'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLogDataInterFaceSuccess from '@/hooks/services/report/log-data-interface-success/useGenerateReportExcelLogDataInterFaceSuccess';
import useGenerateReportPDFLogDataInterfaceSuccess from '@/hooks/services/report/log-data-interface-success/useGenerateReportPDFLogDataInterfaceSuccess';
import useGetDataReportLogDataInterfaceSuccess from '@/hooks/services/report/log-data-interface-success/useGetDataReportLogDataInterfaceSuccess';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetStatusDataSent from '@/hooks/services/report/useGetStatusDataSent';
import useGetTypeOfData from '@/hooks/services/report/useGetTypeOfData';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useCheckAccess from '@/hooks/useCheckAccess';
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
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [customerNameSearchValue, setCustomerNameSearchValue] = useState('');
  const [totalPage, setTotalPage] = useState(1);
  const { recordActivity } = useRecordLog();
  const [divisionSearchValue, setDivisionSearchValue] = useState('');

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.REPORT_LOG_DATA_INTERFACE_DOWNLOAD);

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

  const { data: typeOfData = [], isFetching: isLoadingtypeOfData } = useGetTypeOfData({
    bucketProcessId: '',
    key: '',
  });
  const typeOfDataOptions = (typeOfData?.listParameter ?? []).map((t) => ({
    label: t?.value1,
    value: t?.key,
  }));

  const { data: statusDataSent = [], isFetching: isLoadingstatusDataSent } = useGetStatusDataSent({
    bucketProcessId: '',
    key: '',
  });
  const statusDataSentOptions = (statusDataSent?.listParameter ?? []).map((s) => ({
    label: s?.value1,
    value: s?.key,
  }));

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLogDataInterfaceSuccess(
    searchParams !== null ? {
      filter: {
        ...searchParams,
      },
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      searchDetail: {
        key: '',
        value: '',
      },
    } : null
  );

  const isLoading = isFetching;

  useEffect(() => {
    if (data?.page) {
      setTotalPage(data.page.totalPage > 0 ? data.page.totalPage : 1);
    }
  }, [data, searchParams]);

  useEffect(() => {
    if (isReset) {
      setTotalPage(1);
      setIsReset(false);
    }
  }, [isReset]);

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
  const { mutate: generateExcel } = useGenerateReportExcelLogDataInterFaceSuccess({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report log-data-interface-success',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLogDataInterfaceSuccess({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download pdf report log-data-interface-success',
      });
    },
  });

  const sortState = { order, sort };
  const tableHeader: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '1vw' }, type: 'index' },
    makeSortableColumn('customerId', 'Customer ID', '10vw', sortState, handleSort),
    makeSortableColumn('applicationNo', 'Application No', '10vw', sortState, handleSort),
    makeSortableColumn('idProcess', 'ID Process', '10vw', sortState, handleSort),
    makeSortableColumn('facilityId', 'Facility ID', '10vw', sortState, handleSort),
    makeSortableColumn('facilityNo', 'Facility No', '10vw', sortState, handleSort),
    makeSortableColumn('cif', 'CIF', '10vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '10vw', sortState, handleSort),
    makeSortableColumn('customerStatus', 'Customer Status', '10vw', sortState, handleSort),
    makeSortableColumn('divisionName', 'Division Name', '10vw', sortState, handleSort),
    makeSortableColumn('tanggalKirim', 'Tanggal Kirim', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('typeOfData', 'Type of Data', '10vw', sortState, handleSort),
    makeSortableColumn('statusDataSent', 'Status Pengiriman Data', '10vw', sortState, handleSort),
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
    setSearchParams({
      ...params,
      tanggalKirim: params?.tanggalKirim ? formatDate(params?.tanggalKirim, 'YYYY-MM-DD') : '',
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
    canDownloadFile,
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
    isLoadingDivisions,
    page,
    searchParams,
    setPage,
    setPageSize,
    statusDataSentOptions,
    tableHeader,
    totalPage,
    typeOfDataOptions,
  };
};

export default useTabListData;
