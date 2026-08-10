'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLogAuditTrailActivity from '@/hooks/services/report/log-audit-trail-activity/useGenerateReportExcelLogAuditTrailActivity';
import useGenerateReportPDFLogAuditTrailActivity from '@/hooks/services/report/log-audit-trail-activity/useGenerateReportPDFLogAuditTrailActivity';
import useGetDataReportLogAuditTrailActivity from '@/hooks/services/report/log-audit-trail-activity/useGetDataReportLogAuditTrailActivity';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetGroupName from '@/hooks/services/report/useGetGroupName';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useGetAllMenuName from '@/hooks/useGetAllMenuName';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useTabListData = () => {
  // record log activity
  const { recordActivity } = useRecordLog();

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // reset totalpage
  const [totalPage, setTotalPage] = useState(1);
  const [isReset, setIsReset] = useState(false);

  // user access
  const canCreateFile = useCheckAccess(accessid.REPORT_LOG_AUDIT_TRAIL_ACTIVITY_DOWNLOAD);

  const [groupNameSearchValue, setGroupNameSearchValue] = useState('');
  const [customerNameSearchValue, setCustomerNameSearchValue] = useState('');
  const [activitySearchValue, setActivitySearchValue] = useState('');
  const [menuSearchValue, setMenuSearchValue] = useState('');

  // Group name
  const { data: groupNames = [], isFetching: isLoadingGroupNames } = useGetGroupName({
    value: groupNameSearchValue,
  });
  const groupNameOptions = (groupNames?.contents ?? []).map((d) => ({
    id: d?.groupCode, key: d?.groupCode, label: d?.groupName, value: d?.groupCode,
  }));

  // Customer name
  const { data: customerNames = [], isFetching: isLoadingCustomerNames } = useGetCustomerName({
    value: customerNameSearchValue,
  });
  const customerOptions = (customerNames?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  // Activity
  const { data: activity = [], isFetching: isLoadingActivity } = useGetParameterList('logAuditActivity');
  const activityOptions = (activity ?? []).map((g) =>
    ({ id: g?.value, key: g?.value, label: g?.label, value: g?.value }));

  // Menu name
  const { data: menuNames = [], isFetching: isLoadingMenuNames } = useGetAllMenuName({
    value: menuSearchValue,
  });
  const menuNameOptions = menuNames ?? [];

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLogAuditTrailActivity(
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
  const { mutate: generateExcel } = useGenerateReportExcelLogAuditTrailActivity({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      // record log activity
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report log audit trail activity',
      });

      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLogAuditTrailActivity({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      // record log activity
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download PDF report log audit trail activity',
      });

      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
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
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'cif',
      label: 'CIF',
      onSort: () => handleSort('cif'),
      sortDirection: sort === 'cif' ? order : false,
      sx: { minWidth: '6vw' },
    },
    {
      isSortable: true,
      key: 'customerName',
      label: 'Customer Name',
      onSort: () => handleSort('customerName'),
      sortDirection: sort === 'customerName' ? order : false,
      sx: { minWidth: '18vw' },
    },
    {
      isSortable: true,
      key: 'divisionName',
      label: 'Division Name',
      onSort: () => handleSort('divisionName'),
      sortDirection: sort === 'divisionName' ? order : false,
      sx: { minWidth: '14vw' },
    },
    {
      isSortable: true,
      key: 'userName',
      label: 'Username',
      onSort: () => handleSort('userName'),
      sortDirection: sort === 'userName' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'userDivision',
      label: 'User Division',
      onSort: () => handleSort('userDivision'),
      sortDirection: sort === 'userDivision' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'menu',
      label: 'Menu',
      onSort: () => handleSort('menu'),
      sortDirection: sort === 'menu' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'activity',
      label: 'Activity',
      onSort: () => handleSort('activity'),
      sortDirection: sort === 'activity' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'activityDate',
      label: 'Date',
      onSort: () => handleSort('date'),
      sortDirection: sort === 'date' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'changeBefore',
      label: 'Created',
      onSort: () => handleSort('before'),
      sortDirection: sort === 'before' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'changeAfter',
      label: 'Last Updated',
      onSort: () => handleSort('after'),
      sortDirection: sort === 'after' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'groupName',
      label: 'Group Name',
      onSort: () => handleSort('after'),
      sortDirection: sort === 'after' ? order : false,
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

  const handleGroupNameSearch = (value: string) => {
    if (value.length >= 3) {
      setGroupNameSearchValue(value);
    } else {
      setGroupNameSearchValue('');
    }
  };

  const handleActivitySearch = (value: string) => {
    if (value.length >= 3) {
      setActivitySearchValue(value);
    } else {
      setActivitySearchValue('');
    }
  };

  const handleMenuSearch = (value: string) => {
    if (value.length >= 3) {
      setMenuSearchValue(value);
    } else {
      setMenuSearchValue('');
    }
  };

  return {
    activityOptions,
    canCreateFile,
    customerOptions,
    data,
    groupNameOptions,
    handleActivitySearch,
    handleClear,
    handleDownloadExcel,
    handleDownloadPDF,
    handleGroupNameSearch,
    handleMenuSearch,
    handleSearch,
    isLoading,
    isLoadingActivity,
    isLoadingCustomerNames,
    isLoadingGroupNames,
    isLoadingMenuNames,
    menuNameOptions,
    page,
    searchParams,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
