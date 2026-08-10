'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLaporanCustomerPkAddendum from '@/hooks/services/report/laporan-detail-customer-pk-addendum/useGenerateReportExcelLaporanCustomerPkAddendum';
import useGenerateReportPDFLaporanCustomerPkAddendum from '@/hooks/services/report/laporan-detail-customer-pk-addendum/useGenerateReportPDFLaporanCustomerPkAddendum';
import useGetDataReportLaporanCustomerPkAddendum from '@/hooks/services/report/laporan-detail-customer-pk-addendum/useGetDataReportLaporanCustomerPkAddendum';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
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
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [customerNameSearchValue, setCustomerNameSearchValue] = useState('');
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [totalPage, setTotalPage] = useState(1);
  const { recordActivity } = useRecordLog();

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.REPORT_LAPORAN_PK_ADDENDUM_DOWNLOAD);

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

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanCustomerPkAddendum(
    searchParams !== null
      ? {
        filter: {
          customerNames: searchParams.customerNames ?? [],
          divisions: searchParams.divisions ?? [],
          endDate: searchParams.endDate ?? '',
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanCustomerPkAddendum({
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
        remarks: 'generate download excel report laporan customer pk addendum',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanCustomerPkAddendum({
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
        remarks: 'generate download pdf report laporan customer pk addendum',
      });
    },
  });

  const sortState = { order, sort };
  const tableHeader: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '1vw' }, type: 'index' },
    makeSortableColumn('customerId', 'Customer ID', '10vw', sortState, handleSort),
    makeSortableColumn('cif', 'CIF', '6vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '14vw', sortState, handleSort),
    makeSortableColumn('idFasilitas', 'ID Fasilitas', '14vw', sortState, handleSort),
    makeSortableColumn('nomorFasilitas', 'Nomor Fasilitas', '14vw', sortState, handleSort),
    makeSortableColumn('noAddendum', 'No. PK / No. Adendum', '14vw', sortState, handleSort),
    makeSortableColumn('tipePerjanjian', 'Tipe Perjanjian (PK/Addendum)', '14vw', sortState, handleSort),
    makeSortableColumn('sequence', 'Sequence', '14vw', sortState, handleSort),
    makeSortableColumn('tanggalPkAddendum', 'Tanggal PK/Addendum', '14vw', sortState, handleSort, 'date-only'),
    makeSortableColumn('tanggalEfektif', 'Tanggal Efektif', '14vw', sortState, handleSort, 'date-only'),
    makeSortableColumn('deskripsi', 'Deskripsi', '14vw', sortState, handleSort),
    makeSortableColumn('keteranganDeskripsi', 'Keterangan Deskripsi', '14vw', sortState, handleSort),
    makeSortableColumn('adaSyaratPenandatangan', 'Ada Syarat Penandatangan', '14vw', sortState, handleSort),
    makeSortableColumn('adaSyaratEfektif', 'Ada Syarat Efektif', '14vw', sortState, handleSort),
    makeSortableColumn('division', 'Division', '14vw', sortState, handleSort),
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
    page,
    searchParams,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
