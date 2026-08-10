'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportCSVLaporanCustomerGroup from '@/hooks/services/report/laporan-customer-group/useGenerateReportCSVLaporanCustomerGroup';
import useGenerateReportExcelLaporanCustomerGroup from '@/hooks/services/report/laporan-customer-group/useGenerateReportExcelLaporanCustomerGroup';
import useGenerateReportPDFLaporanCustomerGroup from '@/hooks/services/report/laporan-customer-group/useGenerateReportPDFLaporanCustomerGroup';
import useGetDataReportLaporanCustomerGroup from '@/hooks/services/report/laporan-customer-group/useGetDataReportLaporanCustomerGroup';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetGroupName from '@/hooks/services/report/useGetGroupName';
import useGetAllGamByName from '@/hooks/services/useGetAllGamByName';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useTabListData = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [gamSearchValue, setGamSearchValue] = useState('');
  const [customerSearchValue, setCustomerSearchValue] = useState('');
  const [groupNameSearchValue, setGroupNameSearchValue] = useState('');
  const [totalPage, setTotalPage] = useState(1);
  const [sort, setSort] = useState<string>('groupName');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const { recordActivity } = useRecordLog();

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.LAPORAN_CUSTOMER_GROUP_DOWNLOAD);

  // Get GAM data with search functionality
  const { data: gams = [], isFetching: isLoadingGams } = useGetAllGamByName({
    value: gamSearchValue,
  });
  const gamOptions = (gams ?? []).map((g) => ({
    label: g?.label,
    value: g?.value,
  }));

  const { data: customerName = [], isFetching: isLoadingCustomerOptions } = useGetCustomerName({
    value: customerSearchValue,
  });
  const customerOptions = (customerName?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  const { data: groupName = [], isFetching: isLoadingGroupNames } = useGetGroupName({
    value: groupNameSearchValue,
  });
  const groupNameOptions = (groupName?.contents ?? []).map((g) => ({
    label: g?.groupName,
    value: g?.groupCode,
  }));

  // Get parameter lists
  const { data: jenisGroupOptions = []} = useGetParameterList('groupType', { id: 'key', label: 'value1', value: 'value1' });
  const { data: sektorIndustriOptions = []} = useGetParameterList('sector', { id: 'key', label: 'value1', value: 'value1' });

  // Get report data - only when searchParams is not null
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanCustomerGroup(
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanCustomerGroup({
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
        remarks: 'generate download excel report laporan customer group',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanCustomerGroup({
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
        remarks: 'generate download pdf report laporan customer group',
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
      key: 'groupId',
      label: 'Group ID',
      onSort: () => handleSort('groupId'),
      sortDirection: sort === 'groupId' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'groupName',
      label: 'Group Name',
      onSort: () => handleSort('groupName'),
      sortDirection: sort === 'groupName' ? order : false,
      sx: { minWidth: '12vw' },
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
      key: 'customerId',
      label: 'Customer ID',
      onSort: () => handleSort('customerId'),
      sortDirection: sort === 'customerId' ? order : false,
      sx: { minWidth: '10vw' },
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
      key: 'gam',
      label: 'GAM',
      onSort: () => handleSort('gam'),
      sortDirection: sort === 'gam' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'jenisGroup',
      label: 'Jenis Group',
      onSort: () => handleSort('jenisGroup'),
      sortDirection: sort === 'jenisGroup' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'sektorIndustriGroup',
      label: 'Sektor Industri Group',
      onSort: () => handleSort('sektorIndustriGroup'),
      sortDirection: sort === 'sektorIndustriGroup' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'dataMelampauiGroup',
      label: 'Melampaui BMPK/BMPD/BMPP Group',
      onSort: () => handleSort('dataMelampauiGroup'),
      sortDirection: sort === 'dataMelampauiGroup' ? order : false,
      sx: { minWidth: '20vw' },
    },
    {
      isSortable: true,
      key: 'dataMelampauiAsOf',
      label: 'Data Melampaui BMPK/BMPD/BMPP as of',
      onSort: () => handleSort('dataMelampaui'),
      sortDirection: sort === 'dataMelampaui' ? order : false,
      sx: { minWidth: '22vw' },
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
      endDate,
      startDate,
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

  return {
    canDownloadFile,
    customerOptions,
    data,
    gamOptions,
    groupNameOptions,
    handleClear,
    handleDownloadExcel,
    handleDownloadPDF,
    handleGamSearch,
    handleSearch,
    isLoading,
    isLoadingGams,
    jenisGroupOptions,
    page,
    searchParams,
    sektorIndustriOptions,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
