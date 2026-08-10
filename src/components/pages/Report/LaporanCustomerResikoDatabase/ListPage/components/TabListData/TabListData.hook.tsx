'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLaporanCustomerResikoDatabase from '@/hooks/services/report/laporan-detail-customer-resiko-database/useGenerateReportExcelLaporanCustomerResikoDatabase';
import useGenerateReportPDFLaporanCustomerResikoDatabase from '@/hooks/services/report/laporan-detail-customer-resiko-database/useGenerateReportPDFLaporanCustomerResikoDatabase';
import useGetDataReportLaporanCustomerResikoDatabase from '@/hooks/services/report/laporan-detail-customer-resiko-database/useGetDataReportLaporanCustomerResikoDatabase';
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
  const canCreateFile = useCheckAccess(accessid.REPORT_LAPORAN_RESIKO_DATABASE_DOWNLOAD);

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

  // Summary option
  const { data: summaryOptions = []} = useGetParameterList('cddImplementation', { id: 'key', label: 'value2' });

  const { data: jenisResikoDropdownList } = useGetParameterList('typeOfRiskDEPI');

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanCustomerResikoDatabase(
    searchParams !== null
      ? {
        filter: {
          customerNames: searchParams.customerNames ?? [],
          endDate: searchParams.endDate ?? '',
          jenisResiko: searchParams.jenisResiko ?? [],
          startDate: searchParams.startDate ?? '',
        },
        page: {
          itemPerPage: pageSize,
          noPage: page,
        },
        searchDetail: {
          key: '',
          value: '',
        },
      }
      : null
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanCustomerResikoDatabase({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report detail customer resiko database',
      });

      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanCustomerResikoDatabase({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download PDF report detail customer resiko database',
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
    makeSortableColumn('idProcess', 'ID Process', '10vw', sortState, handleSort),
    makeSortableColumn('customerId', 'Customer ID', '10vw', sortState, handleSort),
    makeSortableColumn('cif', 'CIF', '6vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '14vw', sortState, handleSort),
    makeSortableColumn('noMemo', 'No Memo', '14vw', sortState, handleSort),
    makeSortableColumn('tanggalMemo', 'Tanggal Memo', '14vw', sortState, handleSort, 'date'),
    makeSortableColumn('jenisResiko', 'Jenis Resiko', '14vw', sortState, handleSort),
    makeSortableColumn('namaResiko', 'Nama Resiko', '14vw', sortState, handleSort),
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
    const startDate = params?.startDate ? formatDate(params?.startDate, 'YYYY-MM-DD') : '';
    let endDate = params?.endDate ? formatDate(params?.endDate, 'YYYY-MM-DD') : '';

    if (startDate && !endDate) {
      endDate = formatDate(new Date(), 'YYYY-MM-DD');
    }

    setSearchParams({
      ...params,
      endDate,
      startDate,
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
    summaryOptions,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
