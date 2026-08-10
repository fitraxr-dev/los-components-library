'use client';

import { useState, useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useRouter } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelBmppIndividualDpop from '@/hooks/services/report/bmpp-individual-dpop/useGenerateReportExcelBmppIndividualDpop';
import useGenerateReportPDFBmppIndividualDpop from '@/hooks/services/report/bmpp-individual-dpop/useGenerateReportPDFBmppIndividualDpop';
import useGetDataReportBmppIndividualDpop from '@/hooks/services/report/bmpp-individual-dpop/useGetDataReportBmppIndividualDpop';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
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
  const [customerSearchValue, setCustomerSearchValue] = useState('');
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { recordActivity } = useRecordLog();
  const [totalPage, setTotalPage] = useState(1);

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.BMPP_INDIVIDUAL_DPOP_DOWNLOAD);

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

  const { data: customerTypeOptions = [], isFetching: isLoadingGroupType } =
    useGetParameterList('groupType', { id: 'key', label: 'value1', value: 'key' });

  const { data: conclusionOptions = [], isFetching: isLoadingConclusion } =
    useGetParameterList('summaryBMPP', { id: 'key', label: 'value1', value: 'value1' });

  const customerRelationOptions = [
    { id: 1, label: 'Pihak Terkait', value: 'Pihak Terkait' },
    { id: 2, label: 'Pihak Tidak Terkait', value: 'Pihak Tidak Terkait' }
  ];
  const dataBmppByOptions = [
    { id: 'monitoring', label: 'Monitoring', value: 'monitoring' },
    { id: 'pengajuan', label: 'Pengajuan', value: 'pengajuan' }
  ];

  // Get report data
  const { data, isFetching, error } = useGetDataReportBmppIndividualDpop(
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
  const { mutate: generateExcel } = useGenerateReportExcelBmppIndividualDpop({
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
        remarks: 'generate download excel report bmpp individual dpop',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFBmppIndividualDpop({
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
        remarks: 'generate download pdf report bmpp individual dpop',
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
          onClick: (row) => {
            recordActivity({
              activity: ActivityType.VIEW,
              remarks: `view report bmpp individual dpop detail: ${row?.customerName || 'N/A'} (ID: ${row?.customerId || 'N/A'})`,
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
      key: 'customerId',
      label: 'Customer ID',
      onSort: () => handleSort('customerId'),
      sortDirection: sort === 'customerId' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'cif',
      label: 'CIF',
      onSort: () => handleSort('cif'),
      sortDirection: sort === 'cif' ? order : false,
      sx: { minWidth: '12vw' },
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
      key: 'customerType',
      label: 'Customer Type',
      onSort: () => handleSort('customerType'),
      sortDirection: sort === 'customerType' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'customerRelation',
      label: 'Customer Relation',
      onSort: () => handleSort('customerRelation'),
      sortDirection: sort === 'customerRelation' ? order : false,
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
      key: 'modalEkuitas',
      label: 'Modal Ekuitas',
      onSort: () => handleSort('modalEkuitas'),
      sortDirection: sort === 'modalEkuitas' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'totalFasilitasExistingDebitur',
      label: 'Total Fasilitas Existing Customer',
      onSort: () => handleSort('totalFasilitasExistingDebitur'),
      sortDirection: sort === 'totalFasilitasExistingDebitur' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'persyaratanBmppIndividual',
      label: 'Persyaratan BMPP Individual',
      onSort: () => handleSort('persyaratanBmppIndividual'),
      sortDirection: sort === 'persyaratanBmppIndividual' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'presentaseRealisasiBmppIndividual',
      label: 'Presentase Realisasi BMPP Individual',
      onSort: () => handleSort('presentaseRealisasiBmppIndividual'),
      sortDirection: sort === 'presentaseRealisasiBmppIndividual' ? order : false,
      sx: { minWidth: '12vw' },
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
      key: 'informasiPenarikanDataDataModalPer',
      label: 'Informasi Penarikan Data Modal per Existing',
      onSort: () => handleSort('informasiPenarikanDataDataModalPer'),
      sortDirection: sort === 'informasiPenarikanDataDataModalPer' ? order : false,
      sx: { minWidth: '17vw' },
    },
    {
      isSortable: true,
      key: 'informasiPenarikanDataTanggalInputDataModal',
      label: 'Informasi Penarikan Data Tanggal Input Data Modal',
      onSort: () => handleSort('informasiPenarikanDataTanggalInputDataModal'),
      sortDirection: sort === 'informasiPenarikanDataTanggalInputDataModal' ? order : false,
      sx: { minWidth: '17vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'informasiPenarikanDataFasilitasExisting',
      label: 'Informasi Penarikan Data Fasilitas Existing',
      onSort: () => handleSort('informasiPenarikanDataFasilitasExisting'),
      sortDirection: sort === 'informasiPenarikanDataFasilitasExisting' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'informasiPenarikanDataUsulanFasilitas',
      label: 'Informasi Penarikan Data Usulan Fasilitas',
      onSort: () => handleSort('informasiPenarikanDataUsulanFasilitas'),
      sortDirection: sort === 'informasiPenarikanDataUsulanFasilitas' ? order : false,
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
    NiceModal.show(MODAL.REPORT.BMPP_INDIVIDUAL_DPOP_DETAIL, {
      debtorId: row?.customerId,
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
    customerOptions,
    customerRelationOptions,
    customerTypeOptions,
    data,
    dataBmppByOptions,
    divisionOptions,
    handleClear,
    handleDivisionSearch,
    handleDownloadExcel,
    handleDownloadPDF,
    handleSearch,
    isLoading,
    isLoadingConclusion,
    isLoadingDivisions,
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
