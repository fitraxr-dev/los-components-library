'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelCommentHistoryTracking from '@/hooks/services/report/report-comment-history-tracking/useGenerateReportExcelCommentHistoryTracking';
import useGenerateReportPDFCommentHistoryTracking from '@/hooks/services/report/report-comment-history-tracking/useGenerateReportPDFCommentHistoryTracking';
import useGetDataReportCommentHistoryTracking from '@/hooks/services/report/report-comment-history-tracking/useGetDataReportCommentHistoryTracking';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetGroupName from '@/hooks/services/report/useGetGroupName';
import useGetUsername from '@/hooks/services/report/useGetUsername';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useCheckAccess from '@/hooks/useCheckAccess';
import useGetAllCustomerName from '@/hooks/useGetAllCustomerName';
import useGetAllMenuName from '@/hooks/useGetAllMenuName';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';

// format header table
type SortState = {
  sort: string;
  order: 'asc' | 'desc';
};

const makeSortableColumn = (
  key: string,
  label: string,
  minWidth: string,
  { sort, order }: SortState,
  handleSort: (field: string) => void,
  type?: TableHeader['type'],
): TableHeader => ({
  isSortable: true,
  key,
  label,
  onSort: () => handleSort(key),
  sortDirection: sort === key ? order : false,
  sx: { minWidth },
  type,
});

const useTabListData = () => {
  // record log activity
  const { recordActivity } = useRecordLog();

  // user access
  const canCreateFile = useCheckAccess(accessid.REPORT_COMMENT_HISTORY_TRACKING_DOWNLOAD);

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [customerNameSearchValue, setCustomerNameSearchValue] = useState('');
  const [usernameSearchValue, setUsernameSearchValue] = useState('');
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [totalPage, setTotalPage] = useState(1);

  const [isReset, setIsReset] = useState(false);

  // Division
  const { data: divisions = [], isFetching: isLoadingDivisions } = useSearchAllDivision({
    value: divisionSearchValue,
  });
  const divisionOptions = (divisions?.contents ?? []).map((d) => ({
    label: d?.name,
    value: d?.id,
  }));

  // Customer name
  const { data: customerNames = [], isFetching: isLoadingCustomerNames } = useGetCustomerName({
    value: customerNameSearchValue,
  });
  const customerOptions = (customerNames?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  const { data: username = [], isFetching: isLoadingUsername } = useGetUsername({
    value: usernameSearchValue,
  });
  const usernameOptions = (username?.contents ?? []).map((c) => ({
    label: c?.userName,
    value: c?.userId,
  }));

  const { data: moduleProcessNameOptions = []} = useGetParameterList('newLosProcess');

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportCommentHistoryTracking(
    searchParams !== null ? {
      filter: {
        ...searchParams,
      },
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      sortList: {
        columnName: sort,
        sortType: order,
      },
    } : null
  );

  const isLoading = isFetching;

  // Reset Total Page
  // khusus perubahan data dari API
  useEffect(() => {
    if (data?.page) {
      setTotalPage(data.page.totalPage > 0 ? data.page.totalPage : 1);
    }
  }, [data, searchParams]);

  // khusus reset
  useEffect(() => {
    if (isReset) {
      setTotalPage(1);
      setIsReset(false);
    }
  }, [isReset]);

  // Handle error for table data
  useEffect(() => {
    if (error) {
      showNiceModalV2({
        title: 'Terjadi kesalahan saat mengambil data, silahkan dicoba lagi',
        type: 'error',
      });
    }
  }, [error]);

  const handleSort = (key: string) => {
    if (key === sort) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(key);
      setOrder('asc');
    }
    setPage(1);
  };

  // Generate report mutations
  const { mutate: generateExcel } = useGenerateReportExcelCommentHistoryTracking({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report comment history tracking',
      });

      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFCommentHistoryTracking({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download PDF report comment history tracking',
      });

      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
    },
  });

  const sortState = { order, sort };
  const tableHeader: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '1vw' }, type: 'index' },
    makeSortableColumn('customerId', 'Customer ID', '10vw', sortState, handleSort),
    makeSortableColumn('applicationNo', 'Application No', '10vw', sortState, handleSort),
    makeSortableColumn('processId', 'ID Process', '10vw', sortState, handleSort),
    makeSortableColumn('cif', 'CIF', '10vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '10vw', sortState, handleSort),
    makeSortableColumn('customerStatus', 'Customer Status', '10vw', sortState, handleSort),
    makeSortableColumn('processType', 'Process Type', '10vw', sortState, handleSort),
    makeSortableColumn('divisionName', 'Division Name', '10vw', sortState, handleSort),
    makeSortableColumn('newLosProcess', 'New LOS Process', '10vw', sortState, handleSort),
    makeSortableColumn('userId', 'User ID', '10vw', sortState, handleSort),
    makeSortableColumn('userName', 'Username', '10vw', sortState, handleSort),
    makeSortableColumn('userDivision', 'User Division', '10vw', sortState, handleSort),
    makeSortableColumn('comment', 'Comment', '10vw', sortState, handleSort),
    makeSortableColumn('date', 'Date', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('decision', 'Status', '10vw', sortState, handleSort),
  ];

  const handleClear = () => {
    setSearchParams(null);
    setPage(1);
    setTotalPage(1);
    setIsReset(true);
  };

  const handleDownloadPDF = () => {
    generatePDF(searchParams || {});
  };

  const handleDownloadExcel = () => {
    generateExcel(searchParams || {});
  };

  const handleSearch = (params: any) => {
    const startPeriodDate = params?.startPeriodDate ? formatDate(params?.startPeriodDate, 'YYYY-MM-DD') : '';
    let endPeriodDate = params?.endPeriodDate ? formatDate(params?.endPeriodDate, 'YYYY-MM-DD') : '';

    if (startPeriodDate && !endPeriodDate) {
      endPeriodDate = formatDate(new Date(), 'YYYY-MM-DD');
    }

    setSearchParams({
      customerIds: params?.customerIds || [],
      divisionIds: params?.divisionIds || [],
      endPeriodDate,
      newLosProcess: params?.newLosProcess || [],
      startPeriodDate,
      userIds: params?.userIds || [],
    });
    setPage(1);
    setIsReset(false);
  };

  const handleDivisionSearch = (value: string) => {
    if (value.length >= 3) {
      setDivisionSearchValue(value);
    } else {
      setDivisionSearchValue('');
    }
  };

  return {
    canCreateFile,
    customerOptions,
    data,
    divisionOptions,
    handleClear,
    handleDivisionSearch,
    handleDownloadExcel,
    handleDownloadPDF,
    handleSearch,
    isLoading,
    isLoadingCustomerNames,
    moduleProcessNameOptions,
    page,
    searchParams,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
    usernameOptions,
  };
};

export default useTabListData;
