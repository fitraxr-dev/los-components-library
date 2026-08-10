'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLaporanCustomerLPA from '@/hooks/services/report/laporan-detail-customer-lpa/useGenerateReportExcelLaporanCustomerLPA';
import useGenerateReportPDFLaporanCustomerLPA from '@/hooks/services/report/laporan-detail-customer-lpa/useGenerateReportPDFLaporanCustomerLPA';
import useGetDataReportLaporanCustomerLPA from '@/hooks/services/report/laporan-detail-customer-lpa/useGetDataReportLaporanCustomerLPA';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
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
  const canCreateFile = useCheckAccess(accessid.REPORT_DETAIL_CUSTOMER_LPA_DOWNLOAD);

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('groupName');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // reset total page
  const [totalPage, setTotalPage] = useState(1);
  const [isReset, setIsReset] = useState(false);

  const [customerNameSearchValue, setCustomerNameSearchValue] = useState('');
  const [collateralSearchValue, setCollateralSearchValue] = useState('');

  // Customer name
  const { data: customerNames = [], isFetching: isLoadingCustomerNames } = useGetCustomerName({
    value: customerNameSearchValue,
  });
  const customerOptions = (customerNames?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  // jenis agunan
  const { data: collateral = [], isFetching: isLoadingCollateral } = useGetParameterList('typeCollateralLPA');
  const collateralOptions = (collateral ?? []).map((g) =>
    ({ id: g?.value, key: g?.value, label: g?.label, value: g?.value }));

  // Get report data - only when searchParams is not null
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanCustomerLPA(
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanCustomerLPA({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report detail customer LPA',
      });

      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanCustomerLPA({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download PDF report detail customer LPA',
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
    makeSortableColumn('cif', 'CIF', '10vw', sortState, handleSort),
    makeSortableColumn('rmName', 'Staff Name', '12vw', sortState, handleSort),
    makeSortableColumn('rmDivision', 'Staff Division', '10vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '16vw', sortState, handleSort),
    makeSortableColumn('lpaReportNo', 'No. Kajian LPA', '10vw', sortState, handleSort),
    makeSortableColumn('lpaAssessmentDate', 'Tanggal Kajian LPA', '12vw', sortState, handleSort, 'date'),
    makeSortableColumn('approachUsed', 'Pendekatan Yang Digunakan', '12vw', sortState, handleSort),
    makeSortableColumn('kjppName', 'Nama KJPP', '8vw', sortState, handleSort),
    makeSortableColumn('isKjppPartner', 'KJPP Rekanan', '8vw', sortState, handleSort),
    makeSortableColumn('collateralType', 'Jenis Agunan', '10vw', sortState, handleSort),
    makeSortableColumn('collateralTotalMarketValue', 'Nilai Pasar Total', '12vw', sortState, handleSort),
    makeSortableColumn('collateralTotalMarketValueExchangeRateIdr', 'Exchange Rate', '12vw', sortState, handleSort),
    makeSortableColumn('collateralTotalMarketValueIdr', 'Nilai Pasar Total (Rp)', '12vw', sortState, handleSort),
    makeSortableColumn('collateralTotalLiquidation', 'Indikasi Nilai Likuidasi Total', '12vw', sortState, handleSort),
    makeSortableColumn('collateralTotalLiquidationExchangeRateIdr', 'Exchange Rate', '12vw', sortState, handleSort),
    makeSortableColumn('collateralTotalLiquidationIdr', 'Indikasi Nilai Likuidasi Total (Rp)', '12vw', sortState, handleSort),
    makeSortableColumn('collateralTotal', 'Luas Tanah/Jumlah/Unit/Lot Total', '16vw', sortState, handleSort),
    makeSortableColumn('collateralObjectLocation', 'Lokasi Agunan', '10vw', sortState, handleSort),
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

  const handleCollateralSearch = (value: string) => {
    if (value.length >= 3) {
      setCollateralSearchValue(value);
    } else {
      setCollateralSearchValue('');
    }
  };

  return {
    canCreateFile,
    collateralOptions,
    customerOptions,
    data,
    handleClear,
    handleCollateralSearch,
    handleDownloadExcel,
    handleDownloadPDF,
    handleSearch,
    isLoading,
    isLoadingCollateral,
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
