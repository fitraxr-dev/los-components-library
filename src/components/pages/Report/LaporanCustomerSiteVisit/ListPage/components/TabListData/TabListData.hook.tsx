'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLaporanDetailCustomerSiteVisit from '@/hooks/services/report/laporan-detail-customer-site-visit/useGenerateReportExcelLaporanDetailCustomerSiteVisit';
import useGenerateReportPDFLaporanDetailCustomerSiteVisit from '@/hooks/services/report/laporan-detail-customer-site-visit/useGenerateReportPDFLaporanDetailCustomerSiteVisit';
import useGetDataReportLaporanDetailCustomerSiteVisit from '@/hooks/services/report/laporan-detail-customer-site-visit/useGetDataReportLaporanDetailCustomerSiteVisit';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useTabListData = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('actualEndDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [customerSearchValue, setCustomerSearchValue] = useState('');
  const { recordActivity } = useRecordLog();
  const [totalPage, setTotalPage] = useState(1);

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.LAPORAN_CUSTOMER_SITE_VISIT_DOWNLOAD);

  const { data: customerName = [], isFetching: isLoadingCustomerOptions } = useGetCustomerName({
    value: customerSearchValue,
  });
  const customerOptions = (customerName?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanDetailCustomerSiteVisit(
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanDetailCustomerSiteVisit({
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
        remarks: 'generate download excel report laporan customer site visit',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanDetailCustomerSiteVisit({
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
        remarks: 'generate download pdf report laporan customer site visit',
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
      key: 'dataId',
      label: 'ID',
      onSort: () => handleSort('dataId'),
      sortDirection: sort === 'dataId' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'customerId',
      label: 'Customer ID',
      onSort: () => handleSort('customerId'),
      sortDirection: sort === 'customerId' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'cif',
      label: 'CIF',
      onSort: () => handleSort('cif'),
      sortDirection: sort === 'cif' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'customerName',
      label: 'Customer Name',
      onSort: () => handleSort('customerName'),
      sortDirection: sort === 'customerName' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'proyek',
      label: 'Proyek',
      onSort: () => handleSort('proyek'),
      sortDirection: sort === 'proyek' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'actualStartDate',
      label: 'Actual Start Date',
      onSort: () => handleSort('actualStartDate'),
      sortDirection: sort === 'actualStartDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date-only',
    },
    {
      isSortable: true,
      key: 'actualEndDate',
      label: 'Actual End Date',
      onSort: () => handleSort('actualEndDate'),
      sortDirection: sort === 'actualEndDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date-only',
    },
    {
      isSortable: true,
      key: 'noDocument',
      label: 'No Document',
      onSort: () => handleSort('noDocument'),
      sortDirection: sort === 'noDocument' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'tanggalDocument',
      label: 'Tanggal Document',
      onSort: () => handleSort('tanggalDocument'),
      sortDirection: sort === 'tanggalDocument' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'creator',
      label: 'Creator',
      onSort: () => handleSort('creator'),
      sortDirection: sort === 'creator' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'divisiCreator',
      label: 'Divisi Creator',
      onSort: () => handleSort('divisiCreator'),
      sortDirection: sort === 'divisiCreator' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'lokasiSiteVisit',
      label: 'Lokasi Site Visit',
      onSort: () => handleSort('lokasiSiteVisit'),
      sortDirection: sort === 'lokasiSiteVisit' ? order : false,
      sx: { minWidth: '15vw' },
    },
  ];

  const handleClear = () => {
    setSearchParams(null);
    setPage(1);
    setTotalPage(1);
    setIsReset(true);
  };

  const handleDownloadExcel = () => {
    generateExcel(searchParams || {});
  };

  const handleDownloadPDF = () => {
    generatePDF(searchParams || {});
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

  return {
    canDownloadFile,
    customerOptions,
    data,
    handleClear,
    handleDownloadExcel,
    handleDownloadPDF,
    handleSearch,
    isLoading,
    isLoadingCustomerOptions,
    page,
    searchParams,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
