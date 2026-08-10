'use client';

import { useState, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportCSVApuPpt from '@/hooks/services/report/assessment-apu-ppt/useGenerateReportCSVApuPpt';
import useGenerateReportExcelApuPpt from '@/hooks/services/report/assessment-apu-ppt/useGenerateReportExcelApuPpt';
import useGenerateReportPDFApuPpt from '@/hooks/services/report/assessment-apu-ppt/useGenerateReportPDFApuPpt';
import useGetDataReportApuPpt from '@/hooks/services/report/assessment-apu-ppt/useGetDataReportApuPpt';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useTabListData = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [customerSearchValue, setCustomerSearchValue] = useState('');
  const [sort, setSort] = useState<string>('customerId');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const { recordActivity } = useRecordLog();
  const [totalPage, setTotalPage] = useState(1);

  const [isReset, setIsReset] = useState(false);

  // user access
  const canDownloadFile = useCheckAccess(accessid.REPORT_ASSESSMENT_APU_PPT_DOWNLOAD);

  // Get parameter lists
  const { data: divisions = [], isFetching: isLoadingDivisions } = useSearchAllDivision({
    value: divisionSearchValue,
  });
  const divisionOptions = (divisions?.contents ?? []).map((d) => ({
    label: d?.name,
    value: d?.id,
  }));

  const { data: customerName = [], isFetching: isLoadingCustomerOptions } = useGetCustomerName({
    value: customerSearchValue,
  });
  const customerOptions = (customerName?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  const { data: summaryOptions = []} = useGetParameterList('cddImplementation', { id: 'key', label: 'value2' });

  const terdaftarOptions = [
    { id: true, label: 'Ya', value: 'Ya' },
    { id: false, label: 'Tidak', value: 'Tidak' }
  ];
  const highRiskOptions = terdaftarOptions;

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportApuPpt(
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

  // Handle error for table data
  useEffect(() => {
    if (error) {
      showNiceModalV2({
        title: error?.message || 'Terjadi kesalahan saat mengambil data, silahkan dicoba lagi',
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
  const { mutate: generateExcel } = useGenerateReportExcelApuPpt({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      showNiceModalV2({
        title: data?.content || 'File is processed in background please wait!',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report assessment apu ppt',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFApuPpt({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      showNiceModalV2({
        title: data?.content || 'File is processed in background please wait!',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download pdf report assessment apu ppt',
      });
    },
  });

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '1vw' },
      type: 'index',
    },
    {
      isSortable: true,
      key: 'masterId',
      label: 'Master ID',
      onSort: () => handleSort('masterId'),
      sortDirection: sort === 'masterId' ? order : false,
      sx: { minWidth: '7.5vw' },
    },
    {
      isSortable: true,
      key: 'processId',
      label: 'ID Process',
      onSort: () => handleSort('processId'),
      sortDirection: sort === 'processId' ? order : false,
      sx: { minWidth: '7.5vw' },
    },
    {
      isSortable: true,
      key: 'customerId',
      label: 'Customer ID',
      onSort: () => handleSort('customerId'),
      sortDirection: sort === 'customerId' ? order : false,
      sx: { minWidth: '7.5vw' },
    },
    {
      isSortable: true,
      key: 'cif',
      label: 'CIF',
      onSort: () => handleSort('cif'),
      sortDirection: sort === 'cif' ? order : false,
      sx: { minWidth: '7.5vw' },
    },
    {
      isSortable: true,
      key: 'customerName',
      label: 'Customer Name',
      onSort: () => handleSort('customerName'),
      sortDirection: sort === 'customerName' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'customerCategory',
      label: 'Customer Category',
      onSort: () => handleSort('customerCategory'),
      sortDirection: sort === 'customerCategory' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'institutionType',
      label: 'Institution Type',
      onSort: () => handleSort('institutionType'),
      sortDirection: sort === 'institutionType' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'terdaftarDalamDatabaseKepatuhan',
      label: 'Terdaftar dalam Database Kepatuhan',
      onSort: () => handleSort('terdaftarDalamDatabaseKepatuhan'),
      sortDirection: sort === 'terdaftarDalamDatabaseKepatuhan' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'highRisk',
      label: 'High Risk',
      onSort: () => handleSort('highRisk'),
      sortDirection: sort === 'highRisk' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'highRiskStatusDate',
      label: 'Status High Risk Date',
      onSort: () => handleSort('highRiskStatusDate'),
      sortDirection: sort === 'highRiskStatusDate' ? order : false,
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'createdBy',
      label: 'Assessment APU PPT / Pengkinian Data By',
      onSort: () => handleSort('createdBy'),
      sortDirection: sort === 'createdBy' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'divisionName',
      label: 'Division',
      onSort: () => handleSort('divisionName'),
      sortDirection: sort === 'divisionName' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'createdDate',
      label: 'Assessment APU PPT / Pengkinian Data Date',
      onSort: () => handleSort(' createdDate'),
      sortDirection: sort === ' createdDate' ? order : false,
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'summaryName',
      label: 'Summary Assessment APU PPT/Pengkinian Data',
      onSort: () => handleSort('summaryName'),
      sortDirection: sort === 'summaryName' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'status',
      label: 'Status Assessment APU PPT / Pengkinian Data',
      onSort: () => handleSort('status'),
      sortDirection: sort === 'status' ? order : false,
      sx: { minWidth: '10vw' },
    },
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

  const handleSearch = (params) => {
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
    highRiskOptions,
    isLoading,
    isLoadingDivisions,
    page,
    searchParams,
    setPage,
    setPageSize,
    summaryOptions,
    tableHeader,
    terdaftarOptions,
    totalPage,
  };
};

export default useTabListData;
