'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLaporanCustomerPersetujuanKhusus from '@/hooks/services/report/laporan-detail-customer-persetujuan-khusus/useGenerateReportExcelLaporanCustomerPersetujuanKhusus';
import useGenerateReportPDFLaporanCustomerPersetujuanKhusus from '@/hooks/services/report/laporan-detail-customer-persetujuan-khusus/useGenerateReportPDFLaporanCustomerPersetujuanKhusus';
import useGetDataReportLaporanCustomerPersetujuanKhusus from '@/hooks/services/report/laporan-detail-customer-persetujuan-khusus/useGetDataReportLaporanCustomerPersetujuanKhusus';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetGroupName from '@/hooks/services/report/useGetGroupName';
import useGetParameterList from '@/hooks/services/useGetParameterList';
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
  // record log activity
  const { recordActivity } = useRecordLog();

  // user access
  const canCreateFile = useCheckAccess(accessid.REPORT_LAPORAN_PERSETUJUAN_KHUSUS_DOWNLOAD);

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const [groupNameSearchValue, setGroupNameSearchValue] = useState('');
  const [customerNameSearchValue, setCustomerNameSearchValue] = useState('');
  const [totalPage, setTotalPage] = useState(1);

  const [isReset, setIsReset] = useState(false);

  // Group name
  const { data: groupNames = [], isFetching: isLoadingGroupNames } = useGetGroupName({
    value: groupNameSearchValue,
  });
  const groupNameOptions = (groupNames?.contents ?? []).map((d) => ({
    id: d?.groupCode, key: d?.groupCode, label: d?.groupName, value: d?.groupCode,
  }));

  // Customer name
  const { data: customerNames = [], isFetching: isLoadingCustomerNames } = useGetCustomerName({
    value: customerNameSearchValue,
  });
  const customerOptions = (customerNames?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  const { data: jenisResikoDropdownList } = useGetParameterList('typeOfRiskDEPI');

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanCustomerPersetujuanKhusus(
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanCustomerPersetujuanKhusus({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report detail customer persetujuan khusus',
      });

      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanCustomerPersetujuanKhusus({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download PDF report detail customer persetujuan khusus',
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
    makeSortableColumn('processId', 'ID Process', '10vw', sortState, handleSort),
    makeSortableColumn('customerId', 'Customer ID', '10vw', sortState, handleSort),
    makeSortableColumn('cif', 'CIF', '6vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '14vw', sortState, handleSort),
    makeSortableColumn('specialApproval', 'Persetujuan Khusus', '14vw', sortState, handleSort),
    makeSortableColumn('specialApprovalDescription', 'Deskripsi Persetujuan Khusus', '14vw', sortState, handleSort),
    makeSortableColumn('specialApprovalApplicationDate', 'Tanggal Pengajuan Persetujuan Khusus', '14vw', sortState, handleSort, 'date'),
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
      ...params,
      endPeriodDate,
      startPeriodDate,
    });
    setPage(1);
    setIsReset(false);
  };

  const handleGroupNameSearch = (value: string) => {
    if (value.length >= 3) {
      setGroupNameSearchValue(value);
    } else {
      setGroupNameSearchValue('');
    }
  };

  return {
    canCreateFile,
    customerOptions,
    data,
    groupNameOptions,
    handleClear,
    handleDownloadExcel,
    handleDownloadPDF,
    handleGroupNameSearch,
    handleSearch,
    isLoading,
    isLoadingCustomerNames,
    isLoadingGroupNames,
    jenisResikoDropdownList,
    page,
    searchParams,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
