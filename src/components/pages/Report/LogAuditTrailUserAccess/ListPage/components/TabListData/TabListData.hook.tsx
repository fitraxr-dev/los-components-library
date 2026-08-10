'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLogAuditTrailUserAccess from '@/hooks/services/report/log-audit-trail-user-access/useGenerateReportExcelLogAuditTrailUserAccess';
import useGenerateReportPDFLogAuditTrailUserAccess from '@/hooks/services/report/log-audit-trail-user-access/useGenerateReportPDFLogAuditTrailUserAccess';
import useGetDataReportLogAuditTrailUserAccess from '@/hooks/services/report/log-audit-trail-user-access/useGetDataReportLogAuditTrailUserAccess';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useTabListData = () => {
  // record log activity
  const { recordActivity } = useRecordLog();

  // user access
  const canCreateFile = useCheckAccess(accessid.REPORT_LOG_AUDIT_TRAIL_USER_ACCESS_DOWNLOAD);

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // reset total page
  const [totalPage, setTotalPage] = useState(1);
  const [isReset, setIsReset] = useState(false);

  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [destinationSearchValue, setDestinationSearchValue] = useState('');

  // division
  const { data: division = [], isFetching: isLoadingDivision } = useGetParameterList('division');
  const divisionOptions = (division ?? []).map((g) =>
    ({ id: g?.value, key: g?.value, label: g?.label, value: g?.value }));

  // destination
  const { data: destination = [], isFetching: isLoadingDestination } = useGetParameterList(('division'));
  const destinationOptions = (destination ?? []).map((g) =>
    ({ id: g?.value, key: g?.value, label: g?.label, value: g?.value }));


  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLogAuditTrailUserAccess(
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
  const { mutate: generateExcel } = useGenerateReportExcelLogAuditTrailUserAccess({
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
        remarks: 'generate download excel report log audit trail user access',
      });

      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLogAuditTrailUserAccess({
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
        remarks: 'generate download PDF report log audit trail user access',
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
      key: 'userId',
      label: 'User ID',
      onSort: () => handleSort('userID'),
      sortDirection: sort === 'userID' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'userName',
      label: 'Username',
      onSort: () => handleSort('username'),
      sortDirection: sort === 'username' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'position',
      label: 'Position',
      onSort: () => handleSort('position'),
      sortDirection: sort === 'position' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'originDivision',
      label: 'Origin Division',
      onSort: () => handleSort('originDivision'),
      sortDirection: sort === 'originDivision' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'destination',
      label: 'Destination',
      onSort: () => handleSort('destination'),
      sortDirection: sort === 'destination' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'access',
      label: 'Role Access',
      onSort: () => handleSort('access'),
      sortDirection: sort === 'access' ? order : false,
      sx: { minWidth: '12vw' },
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
      key: 'periode',
      label: 'Periode',
      onSort: () => handleSort('periode'),
      sortDirection: sort === 'periode' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'requestName',
      label: 'Modified By',
      onSort: () => handleSort('requesterName'),
      sortDirection: sort === 'requesterName' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'requestDate',
      label: 'Modified Date',
      onSort: () => handleSort('requestDate'),
      sortDirection: sort === 'requestDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'approvalDate',
      label: 'Approval Date',
      onSort: () => handleSort('approvalDate'),
      sortDirection: sort === 'approvalDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'reference',
      label: 'Reference',
      onSort: () => handleSort('reference'),
      sortDirection: sort === 'reference' ? order : false,
      sx: { minWidth: '12vw' },
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
    setSearchParams({
      ...params,
      changeDate: params?.changeDate ? formatDate(params?.changeDate, 'YYYY-MM-DD') : '',
    });
    setPage(1);
    setIsReset(false);
  };

  // search
  const handleDivisionSearch = (value: string) => {
    if (value.length >= 3) {
      setDivisionSearchValue(value);
    } else {
      setDivisionSearchValue('');
    }
  };

  const handleDestinationSearch = (value: string) => {
    if (value.length >= 3) {
      setDestinationSearchValue(value);
    } else {
      setDestinationSearchValue('');
    }
  };

  return {
    canCreateFile,
    data,
    destinationOptions,
    divisionOptions,
    handleClear,
    handleDestinationSearch,
    handleDivisionSearch,
    handleDownloadExcel,
    handleDownloadPDF,
    handleSearch,
    isLoading,
    isLoadingDestination,
    isLoadingDivision,
    page,
    searchParams,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
