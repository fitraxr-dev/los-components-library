'use client';

import { useState, useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useRouter } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelBmppGroupDpop from '@/hooks/services/report/report-bmpp-group-dpop/useGenerateReportExcelBmppGroupDpop';
import useGenerateReportPDFBmppGroupDpop from '@/hooks/services/report/report-bmpp-group-dpop/useGenerateReportPDFBmppGroupDpop';
import useGetDataReportBmppGroupDpop from '@/hooks/services/report/report-bmpp-group-dpop/useGetDataReportBmppGroupDpop';
import useGetGroupName from '@/hooks/services/report/useGetGroupName';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useTabListData = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [groupNameSearchValue] = useState('');
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { recordActivity } = useRecordLog();
  const [totalPage, setTotalPage] = useState(1);

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.BMPP_GROUP_DPOP_DOWNLOAD);

  // Get parameter lists
  const { data: divisions = [], isFetching: isLoadingDivisions } = useSearchAllDivision({
    value: divisionSearchValue,
  });
  const divisionOptions = (divisions?.contents ?? []).map((d) => ({
    id: d?.id,
    label: d?.name,
    value: d?.id,
  }));

  const { data: customerTypeOptions = [], isFetching: isLoadingGroupType } =
    useGetParameterList('groupType', { id: 'key', label: 'value1', value: 'key' });

  const { data: conclusionOptions = [], isFetching: isLoadingConclusion } =
    useGetParameterList('summaryBMPP', { id: 'key', label: 'value1', value: 'value1' });

  const groupRelationOptions = [
    { id: 1, label: 'Pihak Terkait', value: 'Pihak Terkait' },
    { id: 2, label: 'Pihak Tidak Terkait', value: 'Pihak Tidak Terkait' }
  ];

  const { data: groupName = [], isFetching: isLoadingGroupNames } = useGetGroupName({
    value: groupNameSearchValue,
  });
  const groupNameOptions = (groupName?.contents ?? []).map((g) => ({
    label: g?.groupName,
    value: g?.groupCode,
  }));

  // Get report data
  const { data, isFetching, error } = useGetDataReportBmppGroupDpop(
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
  const { mutate: generateExcel } = useGenerateReportExcelBmppGroupDpop({
    onError: (error: any) => {
      console.log('error', error);
      showNiceModalV2({
        title: error?.message || 'Gagal mengunduh Excel, silahkan dicoba lagi',
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
        remarks: 'generate download excel report bmpp group dpop',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFBmppGroupDpop({
    onError: (error: any) => {
      console.log('error', error);
      showNiceModalV2({
        title: error?.message || 'Gagal mengunduh PDF, silahkan dicoba lagi',
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
        remarks: 'generate download pdf report bmpp group dpop',
      });
    },
  });

  const tableHeader: TableHeader[] = [
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row: any) => {
            recordActivity({
              activity: ActivityType.VIEW,
              remarks: `view report bmpp group dpop detail: ${row?.groupName || 'N/A'} (ID: ${row?.groupId || 'N/A'})`,
            });
            handleViewDetail(row);
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
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
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'groupName',
      label: 'Group Name',
      onSort: () => handleSort('groupName'),
      sortDirection: sort === 'groupName' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'groupType',
      label: 'Group Type',
      onSort: () => handleSort('groupType'),
      sortDirection: sort === 'groupType' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'groupRelation',
      label: 'Group Relation',
      onSort: () => handleSort('groupRelation'),
      sortDirection: sort === 'groupRelation' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'divisionName',
      label: 'Division',
      onSort: () => handleSort('division'),
      sortDirection: sort === 'division' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'modal',
      label: 'Modal',
      onSort: () => handleSort('modal'),
      sortDirection: sort === 'modal' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'totalFasilitasExistingGroup',
      label: 'Total Fasilitas Existing Group',
      onSort: () => handleSort('totalFasilitasExistingGroup'),
      sortDirection: sort === 'totalFasilitasExistingGroup' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'kelonggaranBmppGroup',
      label: 'Kelonggaran BMPP terhadap Group',
      onSort: () => handleSort('kelonggaranBmppGroup'),
      sortDirection: sort === 'kelonggaranBmppGroup' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'persyaratanBmppGroup',
      label: 'Persyaratan BMPP Group',
      onSort: () => handleSort('persyaratanBmppGroup'),
      sortDirection: sort === 'persyaratanBmppGroup' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'presentaseRealisasiBmppGroup',
      label: 'Presentase Realisasi BMPP Group',
      onSort: () => handleSort('presentaseRealisasiBmppGroup'),
      sortDirection: sort === 'presentaseRealisasiBmppGroup' ? order : false,
      sx: { minWidth: '20vw' },
    },
    {
      isSortable: true,
      key: 'kesimpulan',
      label: 'Kesimpulan',
      onSort: () => handleSort('kesimpulan'),
      sortDirection: sort === 'kesimpulan' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'informasiPenarikanDataModalPer',
      label: 'Informasi Penarikan Data Modal per',
      onSort: () => handleSort('informasiPenarikanDataModalPer'),
      sortDirection: sort === 'informasiPenarikanDataModalPer' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'informasiTanggalInputDataModal',
      label: 'Informasi Penarikan Data Tanggal Input Data Modal',
      onSort: () => handleSort('informasiTanggalInputDataModal'),
      sortDirection: sort === 'informasiTanggalInputDataModal' ? order : false,
      sx: { minWidth: '15vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'informasiFasilitasExisting',
      label: 'Informasi Penarikan Data Fasilitas Existing',
      onSort: () => handleSort('informasiFasilitasExisting'),
      sortDirection: sort === 'informasiFasilitasExisting' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'createdDate',
      label: 'Created Date',
      onSort: () => handleSort('createdDate'),
      sortDirection: sort === 'createdDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
  ];

  const handleViewDetail = (row: any) => {
    NiceModal.show(MODAL.REPORT.BMPP_GROUP_DPOP_DETAIL, {
      id: row?.calculationId,
    });
  };

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
      conclusion: params.conclusion,
      customerRelation: params.customerRelation,
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
    conclusionOptions,
    customerTypeOptions,
    data,
    divisionOptions,
    groupNameOptions,
    groupRelationOptions,
    handleClear,
    handleDivisionSearch,
    handleDownloadExcel,
    handleDownloadPDF,
    handleSearch,
    isLoading,
    isLoadingConclusion,
    isLoadingDivisions,
    isLoadingGroupNames,
    isLoadingGroupType,
    page,
    searchParams,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
