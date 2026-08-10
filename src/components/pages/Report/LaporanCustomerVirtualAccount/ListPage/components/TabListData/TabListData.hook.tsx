'use client';

import { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportCSVLaporanCustomerVirtualAccount from '@/hooks/services/report/laporan-customer-virtual-account/useGenerateReportCSVLaporanCustomerVirtualAccount';
import useGenerateReportExcelLaporanCustomerVirtualAccount from '@/hooks/services/report/laporan-customer-virtual-account/useGenerateReportExcelLaporanCustomerVirtualAccount';
import useGenerateReportPDFLaporanCustomerVirtualAccount from '@/hooks/services/report/laporan-customer-virtual-account/useGenerateReportPDFLaporanCustomerVirtualAccount';
import useGetDataReportLaporanCustomerVirtualAccount from '@/hooks/services/report/laporan-customer-virtual-account/useGetDataReportLaporanCustomerVirtualAccount';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetStatusVa from '@/hooks/services/report/useGetStatusVa';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import useGetBucketListStatus from '@/components/pages/UserManagement/UserList/hooks/useGetBucketListStatus';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useTabListData = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [statusVaSearchValue, setStatusVaSearchValue] = useState('');
  const [customerSearchValue, setCustomerSearchValue] = useState('');
  const [sort, setSort] = useState<string>('customerId');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const { recordActivity } = useRecordLog();
  const [totalPage, setTotalPage] = useState(1);

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.LAPORAN_VIRTUAL_ACCOUNT_DOWNLOAD);

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

  const { data: statusVa = [], isFetching: isLoadingStatusVa } = useGetStatusVa({
    value: statusVaSearchValue,
  });
  const statusVaOptions = (statusVa?.contents ?? []).map((v) => ({
    label: v?.name,
    value: v?.id,
  }));

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanCustomerVirtualAccount(
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanCustomerVirtualAccount({
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
        remarks: 'generate download excel report laporan customer virtual account',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanCustomerVirtualAccount({
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
        remarks: 'generate download pdf report laporan customer virtual account',
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
      key: 'idProcess',
      label: 'ID Process',
      onSort: () => handleSort('idProcess'),
      sortDirection: sort === 'idProcess' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'customerStatus',
      label: 'Customer Status',
      onSort: () => handleSort('customerStatus'),
      sortDirection: sort === 'customerStatus' ? order : false,
      sx: { minWidth: '10vw' },
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
      key: 'vaRequestDate',
      label: 'VA Request Date',
      onSort: () => handleSort('vaRequestDate'),
      sortDirection: sort === 'vaRequestDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'vaReviewDate',
      label: 'VA Review Date',
      onSort: () => handleSort('vaReviewDate'),
      sortDirection: sort === 'vaReviewDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'vaApprovedDate',
      label: 'VA Approved Date',
      onSort: () => handleSort('vaApprovedDate'),
      sortDirection: sort === 'vaApprovedDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'vaActivationDate',
      label: 'VA Activation Date',
      onSort: () => handleSort('vaActivationDate'),
      sortDirection: sort === 'vaActivationDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'vaNumber',
      label: 'VA Number',
      onSort: () => handleSort('vaNumber'),
      sortDirection: sort === 'vaNumber' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'statusVa',
      label: 'Status VA',
      onSort: () => handleSort('statusVa'),
      sortDirection: sort === 'statusVa' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'typeOfVa',
      label: 'Type of VA',
      onSort: () => handleSort('typeOfVa'),
      sortDirection: sort === 'typeOfVa' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'facilityData',
      label: 'Facility Data',
      onSort: () => handleSort('facilityData'),
      sortDirection: sort === 'facilityData' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'officerName',
      label: 'Officer Name',
      onSort: () => handleSort('officerName'),
      sortDirection: sort === 'officerName' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'divisionName',
      label: 'Division Name',
      onSort: () => handleSort('divisionName'),
      sortDirection: sort === 'divisionName' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'gam',
      label: 'GAM',
      onSort: () => handleSort('gam'),
      sortDirection: sort === 'gam' ? order : false,
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
    isLoading,
    isLoadingDivisions,
    page,
    searchParams,
    setPage,
    setPageSize,
    statusVaOptions,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
