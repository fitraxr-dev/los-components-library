'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLaporanCustomerFacilities from '@/hooks/services/report/laporan-detail-customer-facilities/useGenerateReportExcelLaporanCustomerFacilities';
import useGenerateReportPDFLaporanCustomerFacilities from '@/hooks/services/report/laporan-detail-customer-facilities/useGenerateReportPDFLaporanCustomerFacilities';
import useGetDataReportLaporanCustomerFacilities from '@/hooks/services/report/laporan-detail-customer-facilities/useGetDataReportLaporanCustomerFacilities';
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

  const canDownloadFile = useCheckAccess(accessid.REPORT_LAPORAN_FACILITIES_DOWNLOAD);

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
  const { data, isLoading: isLoadingQuery, isFetching, error } =
    useGetDataReportLaporanCustomerFacilities(
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

  const contents = (data?.contents ?? []).map((item) => ({
    ...item,
    limitIndukId: item?.financingSegment === 'SYARIAH' ? (item?.limitIndukId || '-') : 'Not Relevant',
  }));

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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanCustomerFacilities({
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
        remarks: 'generate download excel report laporan customer facilities',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanCustomerFacilities({
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
        remarks: 'generate download excel report laporan customer facilities',
      });
    },
  });

  const sortState = { order, sort };
  const tableHeader: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '1vw' }, type: 'index' },
    makeSortableColumn('customerId', 'Customer ID', '10vw', sortState, handleSort),
    makeSortableColumn('applicationNo', 'Application No', '10vw', sortState, handleSort),
    makeSortableColumn('dataId', 'Data ID', '14vw', sortState, handleSort),
    makeSortableColumn('groupId', 'Group ID', '14vw', sortState, handleSort),
    makeSortableColumn('cif', 'CIF', '15vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '10vw', sortState, handleSort),
    makeSortableColumn('customerStatus', 'Customer Status', '14vw', sortState, handleSort),
    makeSortableColumn('masterId', 'Master ID', '14vw', sortState, handleSort),
    makeSortableColumn('orderStatus', 'Order Status', '10vw', sortState, handleSort),
    makeSortableColumn('product', 'Product', '10vw', sortState, handleSort),
    makeSortableColumn('facilityId', 'Facility ID', '10vw', sortState, handleSort),
    makeSortableColumn('limitIndukId', 'ID Limit Induk', '10vw', sortState, handleSort),
    makeSortableColumn('facilityNo', 'Facility No', '10vw', sortState, handleSort),
    makeSortableColumn('penjaminanPemerintah', 'Penjaminan Pemerintah', '10vw', sortState, handleSort),
    makeSortableColumn('pkDate', 'PK Date', '10vw', sortState, handleSort, 'date-only'),
    makeSortableColumn('pkAddendum', 'PK/Addendum No', '10vw', sortState, handleSort),
    makeSortableColumn('typeOfpk', 'Type of PK', '10vw', sortState, handleSort),
    makeSortableColumn('sequencePk', 'Sequence PK', '10vw', sortState, handleSort),
    makeSortableColumn('tenor', 'Tenor', '10vw', sortState, handleSort),
    makeSortableColumn('tanggalBerakhirFasilitas', 'Tanggal Berakhir Fasilitas', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('jatuhTempo', 'Jatuh Tempo', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('interestRate', 'Pricing', '10vw', sortState, handleSort),
    makeSortableColumn('currency', 'Currency', '10vw', sortState, handleSort),
    makeSortableColumn('collectability', 'Collectability', '10vw', sortState, handleSort),
    makeSortableColumn('plafond', 'Plafond', '10vw', sortState, handleSort),
    makeSortableColumn('osPrincipal', 'O/S', '10vw', sortState, handleSort),
    makeSortableColumn('ap', 'AP', '10vw', sortState, handleSort),
    makeSortableColumn('gpPrincipal', 'GP', '10vw', sortState, handleSort),
    makeSortableColumn('restruNon', 'Restru/Non', '10vw', sortState, handleSort),
    makeSortableColumn('pemberianPembiayaan', 'Pemberian Pembiayaan', '10vw', sortState, handleSort),
    makeSortableColumn('programSourceOfFund', 'Program dari Source of Fund', '10vw', sortState, handleSort),
    makeSortableColumn('sourceOfFund', 'Source of Fund', '10vw', sortState, handleSort),
    makeSortableColumn('statusProjectPhase', 'Status Project Phase', '10vw', sortState, handleSort),
    makeSortableColumn('remarksSourceOfFund', 'Remarks Source of Fund', '10vw', sortState, handleSort),
    makeSortableColumn('projectName', 'Project Name', '10vw', sortState, handleSort),
    makeSortableColumn('nilaiProject', 'Nilai Project', '10vw', sortState, handleSort),
    makeSortableColumn('pmn', 'PMN (Y/N)', '10vw', sortState, handleSort),
    makeSortableColumn('nilaiPmn', 'Nilai PMN', '10vw', sortState, handleSort),
    makeSortableColumn('realisasiFisikPmn', 'Realisasi Fisik (PMN)', '10vw', sortState, handleSort),
    makeSortableColumn('activationDate', 'Activation Date', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('dueDateAnnualReview', 'Due Date Annual Review', '10vw', sortState, handleSort, 'date-only'),
    makeSortableColumn('annualReviewAction', 'Annual Review Action', '10vw', sortState, handleSort),
    makeSortableColumn('annualReviewDue', 'Annual Review Due', '10vw', sortState, handleSort, 'date-only'),
    makeSortableColumn('nextAnnualReview', 'Next Annual Review', '10vw', sortState, handleSort, 'date-only'),
    makeSortableColumn('officerName', 'Officer Name', '10vw', sortState, handleSort),
    makeSortableColumn('divisionName', 'Division Name', '10vw', sortState, handleSort),
    makeSortableColumn('gam', 'GAM', '10vw', sortState, handleSort),
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
    contents,
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
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
