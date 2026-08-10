'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLaporanCustomerCreditChecking from '@/hooks/services/report/laporan-detail-customer-credit-checking/useGenerateReportExcelLaporanCustomerCreditChecking';
import useGenerateReportPDFLaporanCustomerCreditChecking from '@/hooks/services/report/laporan-detail-customer-credit-checking/useGenerateReportPDFLaporanCustomerCreditChecking';
import useGetDataReportLaporanCustomerCreditChecking from '@/hooks/services/report/laporan-detail-customer-credit-checking/useGetDataReportLaporanCustomerCreditChecking';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useCheckAccess from '@/hooks/useCheckAccess';
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
  const canCreateFile = useCheckAccess(accessid.REPORT_LAPORAN_CREDIT_CHECKING_DOWNLOAD);

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [customerNameSearchValue, setCustomerNameSearchValue] = useState('');
  const [totalPage, setTotalPage] = useState(1);

  const [isReset, setIsReset] = useState(false);

  // Customer name
  const { data: customerNames = [], isFetching: isLoadingCustomerNames } = useGetCustomerName({
    value: customerNameSearchValue,
  });
  const customerOptions = (customerNames?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanCustomerCreditChecking(
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanCustomerCreditChecking({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report detail customer credit checking',
      });

      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanCustomerCreditChecking({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download PDF report detail customer credit checking',
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
    makeSortableColumn('id', 'ID', '10vw', sortState, handleSort),
    makeSortableColumn('customerId', 'Customer ID', '10vw', sortState, handleSort),
    makeSortableColumn('cif', 'CIF', '10vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '10vw', sortState, handleSort),
    makeSortableColumn('checkedName', 'Nama yang Dicek', '10vw', sortState, handleSort),
    makeSortableColumn('position', 'Position', '10vw', sortState, handleSort),
    makeSortableColumn('memoNo', 'No. Memo', '10vw', sortState, handleSort),
    makeSortableColumn('memoDate', 'Tanggal Memo', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('documentNo', 'No Dokumen', '10vw', sortState, handleSort),
    makeSortableColumn('documentDate', 'Tanggal Dokumen', '15vw', sortState, handleSort, 'date-only'),
    makeSortableColumn('reportResult', 'Hasil laporan', '10vw', sortState, handleSort),
    makeSortableColumn('note', 'Catatan', '10vw', sortState, handleSort),
    makeSortableColumn('googleSearch', 'Google Search', '10vw', sortState, handleSort),
    makeSortableColumn('collectability', 'Kolektabilitas', '10vw', sortState, handleSort),
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

  return {
    canCreateFile,
    customerOptions,
    data,
    handleClear,
    handleDownloadExcel,
    handleDownloadPDF,
    handleSearch,
    isLoading,
    isLoadingCustomerNames,
    page,
    searchParams,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
