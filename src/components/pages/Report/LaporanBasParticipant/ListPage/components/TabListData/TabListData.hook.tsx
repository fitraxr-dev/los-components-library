'use client';

import { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { positions, roles } from '@/configs/constants/general';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelBasAsParticipant from '@/hooks/services/report/bas-as-participant/useGenerateReportExcelBasAsParticipant';
import useGenerateReportPDFBasAsParticipant from '@/hooks/services/report/bas-as-participant/useGenerateReportPDFBasAsParticipant';
import useGetDataReportBasAsParticipant from '@/hooks/services/report/bas-as-participant/useGetDataReportBasAsParticipant';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useDivision from '@/hooks/useDivision';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useTabListData = () => {
  const router = useRouter();
  const { divisionName, divisionCode } = useDivision();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [customerSearchValue, setCustomerSearchValue] = useState('');
  const [totalPage, setTotalPage] = useState(1);
  const [sort, setSort] = useState<string>('businessCallDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { recordActivity } = useRecordLog();

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.LAPORAN_BAS_PARTICIPANT_DOWNLOAD);
  const [appState] = useApp();

  const isMaker = appState?.currentRole?.includes(roles.MAKER);
  const isChecker = appState?.currentRole?.includes(roles.CHECKER);
  const isInternalGuest = appState?.currentPosition?.some((pos: string) =>
    pos.toUpperCase().includes(positions.INTERNAL_GUEST)
  );

  const canChangeDivision = isInternalGuest || isMaker || isChecker;

  // Get parameter lists
  // const { data: divisionOptions = []} = useGetParameterList('division');
  const { data: divisions = [], isFetching: isLoadingDivisions } = useSearchAllDivision({
    value: divisionSearchValue,
  });
  const divisionOptions = (divisions?.contents ?? []).map((d) => ({ id: d?.id, label: d?.name, value: d?.id }));
  const { data: summaryOptions = []} = useGetParameterList('summaryBasAsParticipant');
  const { data: statusOptions = []} = useGetParameterList('statusBasAsParticipant');

  const { data: customerName = [], isFetching: isLoadingCustomerOptions } = useGetCustomerName({
    value: customerSearchValue,
  });
  const customerOptions = (customerName?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));
  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportBasAsParticipant(
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
  const { mutate: generateExcel } = useGenerateReportExcelBasAsParticipant({
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
        remarks: 'generate download excel report laporan bas as participant',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFBasAsParticipant({
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
        remarks: 'generate download pdf report laporan bas as participant',
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
      key: 'sequence',
      label: 'Seq.',
      onSort: () => handleSort('sequence'),
      sortDirection: sort === 'sequence' ? order : false,
      sx: { minWidth: '5vw' },
    },
    {
      isSortable: true,
      key: 'participant',
      label: 'Participant',
      onSort: () => handleSort('participant'),
      sortDirection: sort === 'participant' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'name',
      label: 'Name',
      onSort: () => handleSort('name'),
      sortDirection: sort === 'name' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'division',
      label: 'Division',
      onSort: () => handleSort('division'),
      sortDirection: sort === 'division' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'businessCallDate',
      label: 'Business Call Date',
      onSort: () => handleSort('businessCallDate'),
      sortDirection: sort === 'businessCallDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date-only',
    },
    {
      isSortable: true,
      key: 'businessCallTime',
      label: 'Business Call Time',
      onSort: () => handleSort('businessCallTime'),
      sortDirection: sort === 'businessCallTime' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'media',
      label: 'Media',
      onSort: () => handleSort('media'),
      sortDirection: sort === 'media' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'perwakilanClient',
      label: 'Perwakilan Klien (Nama & Jabatan)',
      onSort: () => handleSort('perwakilanClient'),
      sortDirection: sort === 'perwakilanClient' ? order : false,
      sx: { minWidth: '18vw' },
    },
    {
      isSortable: true,
      key: 'perwakilanSmi',
      label: 'Perwakilan SMI',
      onSort: () => handleSort('perwakilanSmi'),
      sortDirection: sort === 'perwakilanSmi' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'companyName',
      label: 'Nama Entitas',
      onSort: () => handleSort('companyName'),
      sortDirection: sort === 'companyName' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'isNewClient',
      label: 'New/Existing Client',
      onSort: () => handleSort('isNewClient'),
      sortDirection: sort === 'isNewClient' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'groupName',
      label: 'Group Name',
      onSort: () => handleSort('groupName'),
      sortDirection: sort === 'groupName' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'infrastructureSector',
      label: 'Infrastructure Sector',
      onSort: () => handleSort('infrastructureSector'),
      sortDirection: sort === 'infrastructureSector' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'businessCallType',
      label: 'Business Call Type',
      onSort: () => handleSort('businessCallType'),
      sortDirection: sort === 'businessCallType' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'summaryAlert',
      label: 'Summary Alert',
      onSort: () => handleSort('summaryAlert'),
      sortDirection: sort === 'summaryAlert' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'businessCourtesySummary',
      label: 'Business Courtesy Summary',
      onSort: () => handleSort('businessCourtesySummary'),
      sortDirection: sort === 'businessCourtesySummary' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'maintenanceSummary',
      label: 'Maintenance Summary',
      onSort: () => handleSort('maintenanceSummary'),
      sortDirection: sort === 'maintenanceSummary' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'monitoringSummary',
      label: 'Monitoring Summary',
      onSort: () => handleSort('monitoringSummary'),
      sortDirection: sort === 'monitoringSummary' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'siteVisitRemark',
      label: 'Site Visit Remark',
      onSort: () => handleSort('siteVisitRemark'),
      sortDirection: sort === 'siteVisitRemark' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'pembahasanDalamBusinessCall',
      label: 'Pembahasan Dalam Business Call',
      onSort: () => handleSort('pembahasanDalamBusinessCall'),
      render: (data: any) => (
        <TextStyle
          variant="body4"
          sx={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }}
        >
          {data.pembahasanDalamBusinessCall || '-'}
        </TextStyle>
      ),
      sortDirection: sort === 'pembahasanDalamBusinessCall' ? order : false,
      sx: { minWidth: '18vw' },
    },
    {
      isSortable: true,
      key: 'followUpItemsList',
      label: 'Follow Up Items List',
      onSort: () => handleSort('followUpItemsList'),
      render: (data: any) => (
        <TextStyle
          variant="body4"
          sx={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }}
        >
          {data.followUpItemsList || '-'}
        </TextStyle>
      ),
      sortDirection: sort === 'followUpItemsList' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'reportSubmissionDate',
      label: 'Report Submission Date',
      onSort: () => handleSort('reportSubmissionDate'),
      sortDirection: sort === 'reportSubmissionDate' ? order : false,
      sx: { minWidth: '15vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'approverName',
      label: 'Approver’s Comments',
      onSort: () => handleSort('approverName'),
      sortDirection: sort === 'approverName' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'approverStatus',
      label: 'Approver Status',
      onSort: () => handleSort('approverStatus'),
      sortDirection: sort === 'approverStatus' ? order : false,
      sx: { minWidth: '12vw' },
    },

    {
      isSortable: true,
      key: 'approvedDate',
      label: 'Approver Date',
      onSort: () => handleSort('approvedDate'),
      sortDirection: sort === 'approvedDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'lampiran',
      label: 'Lampiran',
      onSort: () => handleSort('lampiran'),
      sortDirection: sort === 'lampiran' ? order : false,
      sx: { minWidth: '10vw' },
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

    let finalDivision: string[] = divisionCode ? [divisionCode] : [];
    if (canChangeDivision) {
      finalDivision = params.division && params.division.length > 0 ? params.division : [];
    }

    setSearchParams({
      ...params,
      division: finalDivision,
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
    canChangeDivision,
    canDownloadFile,
    customerOptions,
    data,
    divisionName,
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
    summaryOptions,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
