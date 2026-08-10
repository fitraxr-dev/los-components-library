'use client';

import { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportCSVLaporanDetailCustomerPipeline from '@/hooks/services/report/laporan-detail-customer-pipeline/useGenerateReportCSVLaporanDetailCustomerPipeline';
import useGenerateReportExcelLaporanDetailCustomerPipeline from '@/hooks/services/report/laporan-detail-customer-pipeline/useGenerateReportExcelLaporanDetailCustomerPipeline';
import useGenerateReportPDFLaporanDetailCustomerPipeline from '@/hooks/services/report/laporan-detail-customer-pipeline/useGenerateReportPDFLaporanDetailCustomerPipeline';
import useGetDataReportLaporanDetailCustomerPipeline from '@/hooks/services/report/laporan-detail-customer-pipeline/useGetDataReportLaporanDetailCustomerPipeline';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useCheckAccess from '@/hooks/useCheckAccess';
import useDivision from '@/hooks/useDivision';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useTabListData = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [customerSearchValue, setCustomerSearchValue] = useState('');
  const [sort, setSort] = useState<string>('pipelineCreationDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { recordActivity } = useRecordLog();
  const [totalPage, setTotalPage] = useState(1);

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.LAPORAN_DETAIL_CUSTOMER_PIPELINE_DOWNLOAD);

  // Get parameter lists
  const { data: divisions = [], isFetching: isLoadingDivisions } = useSearchAllDivision({
    value: divisionSearchValue,
  });
  const divisionOptions = (divisions?.contents ?? []).map((d) => ({ id: d?.id, label: d?.name }));

  const { data: statusOptions = []} = useGetParameterList('pipelineStatus', { id: 'key', label: 'value1' });

  const additionalPlafondOptions = [
    { id: 'Ya', label: 'Ya', value: 'Ya' },
    { id: 'Tidak', label: 'Tidak', value: 'Tidak' }
  ];

  const { data: customerName = [], isFetching: isLoadingCustomerOptions } = useGetCustomerName({
    value: customerSearchValue,
  });
  const customerOptions = (customerName?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanDetailCustomerPipeline(
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanDetailCustomerPipeline({
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
        remarks: 'generate download excel report laporan customer pipeline',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanDetailCustomerPipeline({
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
        remarks: 'generate download pdf report laporan customer pipeline',
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
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'customerStatus',
      label: 'Customer Status',
      onSort: () => handleSort('customerStatus'),
      sortDirection: sort === 'customerStatus' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'processType',
      label: 'Process Type',
      onSort: () => handleSort('processType'),
      sortDirection: sort === 'processType' ? order : false,
      sx: { minWidth: '10vw' },
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
      key: 'existingPlafond',
      label: 'Existing Plafond',
      onSort: () => handleSort('existingPlafond'),
      sortDirection: sort === 'existingPlafond' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'addNewPlafond',
      label: 'Ada Penambahan Plafond/Pengajuan Baru',
      onSort: () => handleSort('addNewPlafond'),
      sortDirection: sort === 'addNewPlafond' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'proposalPlafondPlus',
      label: 'Plafond Usulan (+)',
      onSort: () => handleSort('proposalPlafondPlus'),
      sortDirection: sort === 'proposalPlafondPlus' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'proposalPlafondMinus',
      label: 'Plafond Usulan (−)',
      onSort: () => handleSort('proposalPlafondMinus'),
      sortDirection: sort === 'proposalPlafondMinus' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'dataId',
      label: 'Data ID',
      onSort: () => handleSort('dataId'),
      sortDirection: sort === 'dataId' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'processId',
      label: 'ID Process',
      onSort: () => handleSort('processId'),
      sortDirection: sort === 'processId' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'status',
      label: 'Status',
      onSort: () => handleSort('status'),
      sortDirection: sort === 'status' ? order : false,
      sx: { minWidth: '8vw' },
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
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'pipelineCreationDate',
      label: 'Pipeline Creation Date',
      onSort: () => handleSort('pipelineCreationDate'),
      sortDirection: sort === 'pipelineCreationDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'pipelineApprovedDate',
      label: 'Pipeline Approved Date',
      onSort: () => handleSort('pipelineApprovedDate'),
      sortDirection: sort === 'pipelineApprovedDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
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

  const handleSearch = (params: any) => {
    const startDate = params?.startDate ? formatDate(params?.startDate, 'YYYY-MM-DD') : '';
    let endDate = params?.endDate ? formatDate(params?.endDate, 'YYYY-MM-DD') : '';

    if (startDate && !endDate) {
      endDate = formatDate(new Date(), 'YYYY-MM-DD');
    }

    setSearchParams({
      ...params,
      additionalPlafondOptions: params.additionalPlafondOptions,
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
    additionalPlafondOptions,
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
    statusOptions,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
