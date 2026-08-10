'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLaporanCustomerProject from '@/hooks/services/report/laporan-detail-customer-project/useGenerateReportExcelLaporanDetailCustomerProject';
import useGenerateReportPDFLaporanCustomerProject from '@/hooks/services/report/laporan-detail-customer-project/useGenerateReportPDFLaporanDetailCustomerProject';
import useGetDataReportLaporanCustomerProject from '@/hooks/services/report/laporan-detail-customer-project/useGetDataReportLaporanDetailCustomerProject';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetAllGamByName from '@/hooks/services/useGetAllGamByName';
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
  const canCreateFile = useCheckAccess(accessid.REPORT_DETAIL_CUSTOMER_PROJECT_DOWNLOAD);

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('groupName');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // reset total page
  const [totalPage, setTotalPage] = useState(1);
  const [isReset, setIsReset] = useState(false);

  const [gamSearchValue, setGamSearchValue] = useState('');
  const [customerNameSearchValue, setCustomerNameSearchValue] = useState('');
  const [divisionSearchValue, setDivisionSearchValue] = useState('');

  // Get GAM data with search functionality
  const { data: gams = [], isFetching: isLoadingGams } = useGetAllGamByName({
    value: gamSearchValue,
  });
  const gamOptions = (gams ?? []).map((g) => ({ id: g?.value, label: g?.label, value: g?.value }));

  // Customer name
  const { data: customerNames = [], isFetching: isLoadingCustomerNames } = useGetCustomerName({
    value: customerNameSearchValue,
  });
  const customerOptions = (customerNames?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  // division
  const { data: division = [], isFetching: isLoadingDivision } = useGetParameterList('division');
  const divisionOptions = (division ?? []).map((g) =>
    ({ id: g?.value, key: g?.value, label: g?.label, value: g?.value }));

  // Get report data - only when searchParams is not null
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanCustomerProject(
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanCustomerProject({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report detail customer project',
      });

      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanCustomerProject({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download PDF report detail customer project',
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
    makeSortableColumn('cif', 'CIF', '6vw', sortState, handleSort),
    makeSortableColumn('rmName', 'Staff Name', '12vw', sortState, handleSort),
    makeSortableColumn('rmDivision', 'Staff Division', '10vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '14vw', sortState, handleSort),

    makeSortableColumn('projectName', 'Project Name', '14vw', sortState, handleSort),
    makeSortableColumn('projectDescription', 'Project Description', '15vw', sortState, handleSort),
    makeSortableColumn('projectSector', 'Sektor Yang Dibiayai', '10vw', sortState, handleSort),
    makeSortableColumn('projectStartDate', 'Start Date', '14vw', sortState, handleSort, 'date'),
    makeSortableColumn('projectEndDate', 'End Date', '14vw', sortState, handleSort, 'date'),
    makeSortableColumn('projectValue', 'Nilai Project', '10vw', sortState, handleSort),
    makeSortableColumn('exchangeRate', 'Exchange Rate', '10vw', sortState, handleSort),
    makeSortableColumn('projectValueIdr', 'Nilai Project (Rp)', '10vw', sortState, handleSort),

    makeSortableColumn('projectLocationAddress', 'Address', '18vw', sortState, handleSort),
    makeSortableColumn('projectLocationProvince', 'Lokasi (Provinsi)', '12vw', sortState, handleSort),
    makeSortableColumn('projectLocationCity', 'Lokasi (Kota-kabupaten)', '12vw', sortState, handleSort),
    makeSortableColumn('projectLocationDistrict', 'Lokasi (Kecamatan)', '12vw', sortState, handleSort),
    makeSortableColumn('projectLocationVillage', 'Lokasi (Kelurahan)', '12vw', sortState, handleSort),

    makeSortableColumn('postalCode', 'Postal Code', '8vw', sortState, handleSort),
    makeSortableColumn('projectPhase', 'Project Phase', '8vw', sortState, handleSort),
    makeSortableColumn('statusAsOf', 'Status as Of', '14vw', sortState, handleSort, 'date'),
    makeSortableColumn('isPmn', 'PMN (Y/N)', '10vw', sortState, handleSort),
    makeSortableColumn('pmnValue', 'Nilai PMN', '10vw', sortState, handleSort),
    makeSortableColumn('physicalRealization', 'Realisasi Fisik', '10vw', sortState, handleSort),

    makeSortableColumn('projectOwnerName', 'Pemilik', '14vw', sortState, handleSort),
    makeSortableColumn('projectOwnerAddress', 'Alamat Kantor Pemilik', '18vw', sortState, handleSort),
    makeSortableColumn('projectOwnerWebsite', 'Website Pemilik', '10vw', sortState, handleSort),
    makeSortableColumn('projectOwnerContactName', 'Nama Kontak Pemilik', '14vw', sortState, handleSort),
    makeSortableColumn('projectOwnerContactEmail', 'Email Kontak Pemilik', '14vw', sortState, handleSort),
    makeSortableColumn('projectOwnerContactPhone', 'Telepon Kontak Pemilik', '10vw', sortState, handleSort),

    makeSortableColumn('contractorName', 'Nama Kontraktor', '14vw', sortState, handleSort),
    makeSortableColumn('contractorAddress', 'Alamat Kantor Kontraktor', '18vw', sortState, handleSort),
    makeSortableColumn('contractorWebsite', 'Website Kontraktor', '10vw', sortState, handleSort),

    makeSortableColumn('contractorContactName', 'Nama Kontak Kontraktor', '14vw', sortState, handleSort),
    makeSortableColumn('contractorContactEmail', 'Email Kontak Kontraktor', '14vw', sortState, handleSort),
    makeSortableColumn('contractorContactPhone', 'Telepon Kontak Kontraktor', '10vw', sortState, handleSort),
    makeSortableColumn('contractorClassification', 'klasifikasi Usaha Kontraktor', '10vw', sortState, handleSort),

    makeSortableColumn('facilityId', 'Facility ID', '8vw', sortState, handleSort),
    makeSortableColumn('facilityNo', 'Facility No', '8vw', sortState, handleSort),
    makeSortableColumn('gam', 'GAM', '16vw', sortState, handleSort),
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

  const handleGamSearch = (value: string) => {
    if (value.length >= 3) {
      setGamSearchValue(value);
    } else {
      setGamSearchValue('');
    }
  };

  const handleCustomerNameSearch = (value: string) => {
    if (value.length >= 3) {
      setCustomerNameSearchValue(value);
    } else {
      setCustomerNameSearchValue('');
    }
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
    gamOptions,
    handleClear,
    handleCustomerNameSearch,
    handleDivisionSearch,
    handleDownloadExcel,
    handleDownloadPDF,
    handleGamSearch,
    handleSearch,
    isLoading,
    isLoadingCustomerNames,
    isLoadingDivision,
    isLoadingGams,
    page,
    searchParams,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
