'use client';

import { useState, useEffect } from 'react';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateExcelLaporanAssignment from '@/hooks/services/report/laporan-assignment/useGenerateExcelLaporanAssignment';
import useGeneratePDFLaporanAssignment from '@/hooks/services/report/laporan-assignment/useGeneratePDFLaporanAssignment';
import useGetListLaporanAssignment from '@/hooks/services/report/laporan-assignment/useGetListLaporanAssignment';
import useGetLovAllCustomer from '@/hooks/services/report/laporan-assignment/useGetLovAllCustomer';
import useGetLovAllPicName from '@/hooks/services/report/laporan-assignment/useGetLovAllPicName';
import useGetLovAllProcess from '@/hooks/services/report/laporan-assignment/useGetLovAllProcess';
import useGetLovAllRole from '@/hooks/services/report/laporan-assignment/useGetLovAllRole';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useTabListData = () => {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [roleSearchValue, setRoleSearchValue] = useState('');
  const [sort, setSort] = useState<string>('customerId');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const { recordActivity } = useRecordLog();
  const [totalPage, setTotalPage] = useState(1);

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.REPORT_LOG_REASSIGNMENT_DOWNLOAD);

  // LOV: Nama Process
  const { data: processData = [], isFetching: isLoadingProcess } = useGetLovAllProcess();
  const processOptions = (processData?.contents ?? []).map((p) => ({
    label: p?.label,
    value: p?.process,
  }));

  // LOV: Nama Customer
  const { data: customerData = [], isFetching: isLoadingCustomer } = useGetLovAllCustomer();
  const customerOptions = (customerData?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  // LOV: Nama PIC
  const { data: usernameData = [], isFetching: isLoadingUsername } = useGetLovAllPicName();
  const usernameOptions = (usernameData?.contents ?? []).map((u) => ({
    label: u?.userName,
    value: u?.userId,
  }));

  // LOV: Jabatan
  const { data: roleData = [], isFetching: isLoadingRole } = useGetLovAllRole({
    filter: {
      group: '',
    },
    page: {
      itemPerPage: 50,
      noPage: 1,
    },
    searchDetail: {
      key: 'name',
      value: roleSearchValue,
    },
    sortList: {
      columnName: 'name',
      sortType: 'asc',
    },
  });
  const roleOptions = (roleData?.contents ?? []).map((r) => ({
    label: r?.label,
    value: r?.key,
  }));

  // LOV: Jenis Reassignment
  const jenisReassignmentOptions = [
    { label: 'Monitoring', value: '0' },
    { label: 'Reassignment/SKU', value: '1' },
  ];

  // LOV: Status Reassignment
  const statusReassignmentOptions = [
    { id: '0', label: 'Non Active' },
    { id: '1', label: 'Active' },
    { id: '2', label: 'Waiting Approval' },
  ];

  // Get report data
  const { data, isFetching, error } = useGetListLaporanAssignment(
    searchParams !== null ? {
      filter: {
        jabatanPicAsal: searchParams.jabatanPicAsal ?? [],
        jabatanPicTujuan: searchParams.jabatanPicTujuan ?? [],
        jenisReassignment: searchParams.jenisReassignment ?? [],
        namaCustomer: searchParams.namaCustomer ?? [],
        namaPicAsal: searchParams.namaPicAsal ?? [],
        namaPicTujuan: searchParams.namaPicTujuan ?? [],
        namaProcess: searchParams.namaProcess ?? [],
        statusReassignment: searchParams.statusReassignment ?? '',
        tanggalMulai: searchParams.tanggalMulai ?? '',
        tanggalSelesai: searchParams.tanggalSelesai ?? '',
      },
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      searchDetail: {
        key: '',
        value: '',
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
  const { mutate: generateExcel } = useGenerateExcelLaporanAssignment({
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
        remarks: 'generate download excel report laporan reassignment',
      });
    },
  });

  const { mutate: generatePDF } = useGeneratePDFLaporanAssignment({
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
        remarks: 'generate download pdf report laporan reassignment',
      });
    },
  });

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3vw' },
      type: 'index',
    },
    {
      isSortable: true,
      key: 'jenisReassignment',
      label: 'Jenis Reassignment',
      onSort: () => handleSort('jenisReassignment'),
      sortDirection: sort === 'jenisReassignment' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'namaRequester',
      label: 'Requester Name',
      onSort: () => handleSort('namaRequester'),
      sortDirection: sort === 'namaRequester' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'jabatanRequester',
      label: 'Jabatan Requester',
      onSort: () => handleSort('jabatanRequester'),
      sortDirection: sort === 'jabatanRequester' ? order : false,
      sx: { minWidth: '11vw' },
    },
    {
      isSortable: true,
      key: 'tanggalReassignment',
      label: 'Tanggal Reassignment',
      onSort: () => handleSort('tanggalReassignment'),
      sortDirection: sort === 'tanggalReassignment' ? order : false,
      sx: { minWidth: '13vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'skuId',
      label: 'SKU ID',
      onSort: () => handleSort('skuId'),
      sortDirection: sort === 'skuId' ? order : false,
      sx: { minWidth: '5vw' },
    },
    {
      isSortable: true,
      key: 'masterId',
      label: 'Master ID',
      onSort: () => handleSort('masterId'),
      sortDirection: sort === 'masterId' ? order : false,
      sx: { minWidth: '7vw' },
    },
    {
      isSortable: true,
      key: 'processId',
      label: 'ID Process',
      onSort: () => handleSort('processName'),
      sortDirection: sort === 'processName' ? order : false,
      sx: { minWidth: '7vw' },
    },
    {
      isSortable: true,
      key: 'processName',
      label: 'Nama Process',
      onSort: () => handleSort('processName'),
      sortDirection: sort === 'processName' ? order : false,
      sx: { minWidth: '9vw' },
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
      key: 'customerName',
      label: 'Customer Name',
      onSort: () => handleSort('customerName'),
      sortDirection: sort === 'customerName' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'namaPicAsal',
      label: 'Nama PIC Asal',
      onSort: () => handleSort('namaPicAsal'),
      sortDirection: sort === 'namaPicAsal' ? order : false,
      sx: { minWidth: '9vw' },
    },
    {
      isSortable: true,
      key: 'jabatanPicAsal',
      label: 'Jabatan PIC Asal',
      onSort: () => handleSort('jabatanPicAsal'),
      sortDirection: sort === 'jabatanPicAsal' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'namaPicTujuan',
      label: 'Nama PIC Tujuan',
      onSort: () => handleSort('namaPicTujuan'),
      sortDirection: sort === 'namaPicTujuan' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'jabatanPicTujuan',
      label: 'Jabatan PIC Tujuan',
      onSort: () => handleSort('jabatanPicTujuan'),
      sortDirection: sort === 'jabatanPicTujuan' ? order : false,
      sx: { minWidth: '11vw' },
    },
    {
      isSortable: true,
      key: 'tanggalMulai',
      label: 'Tanggal Mulai',
      onSort: () => handleSort('tanggalMulai'),
      sortDirection: sort === 'tanggalMulai' ? order : false,
      sx: { minWidth: '9vw' },
      type: 'date-only',
    },
    {
      isSortable: true,
      key: 'tanggalSelesai',
      label: 'Tanggal Selesai',
      onSort: () => handleSort('tanggalSelesai'),
      sortDirection: sort === 'tanggalSelesai' ? order : false,
      sx: { minWidth: '10vw' },
      type: 'date-only',
    },
    {
      isSortable: true,
      key: 'durasi',
      label: 'Durasi',
      onSort: () => handleSort('durasi'),
      sortDirection: sort === 'durasi' ? order : false,
      sx: { minWidth: '5vw' },
    },
    {
      isSortable: true,
      key: 'statusReassignment',
      label: 'Status Reassignment',
      onSort: () => handleSort('statusReassignment'),
      sortDirection: sort === 'statusReassignment' ? order : false,
      sx: { minWidth: '12vw' },
    },
  ];

  const handleClear = () => {
    setSearchParams(null);
    setPage(1);
    setTotalPage(1);
    setIsReset(true);
    setRoleSearchValue('');
  };

  const handleDownloadPDF = () => {
    const payload = searchParams !== null ? {
      filter: {
        jabatanPicAsal: searchParams.jabatanPicAsal ?? [],
        jabatanPicTujuan: searchParams.jabatanPicTujuan ?? [],
        jenisReassignment: searchParams.jenisReassignment ?? [],
        namaCustomer: searchParams.namaCustomer ?? [],
        namaPicAsal: searchParams.namaPicAsal ?? [],
        namaPicTujuan: searchParams.namaPicTujuan ?? [],
        namaProcess: searchParams.namaProcess ?? [],
        statusReassignment: searchParams.statusReassignment ?? '',
        tanggalMulai: searchParams.tanggalMulai ?? '',
        tanggalSelesai: searchParams.tanggalSelesai ?? '',
      },
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      searchDetail: {
        key: '',
        value: '',
      },
    } : {};

    generatePDF(payload);
  };

  const handleDownloadExcel = () => {
    const payload = searchParams !== null ? {
      filter: {
        jabatanPicAsal: searchParams.jabatanPicAsal ?? [],
        jabatanPicTujuan: searchParams.jabatanPicTujuan ?? [],
        jenisReassignment: searchParams.jenisReassignment ?? [],
        namaCustomer: searchParams.namaCustomer ?? [],
        namaPicAsal: searchParams.namaPicAsal ?? [],
        namaPicTujuan: searchParams.namaPicTujuan ?? [],
        namaProcess: searchParams.namaProcess ?? [],
        statusReassignment: searchParams.statusReassignment ?? '',
        tanggalMulai: searchParams.tanggalMulai ?? '',
        tanggalSelesai: searchParams.tanggalSelesai ?? '',
      },
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      searchDetail: {
        key: '',
        value: '',
      },
    } : {};

    generateExcel(payload);
  };

  const handleSearch = (params) => {
    const startDate = params?.startDate ? formatDate(params?.startDate, 'YYYY-MM-DD') : '';
    const endDate = params?.endDate ? formatDate(params?.endDate, 'YYYY-MM-DD') : '';

    const searchPayload = {
      jabatanPicAsal: params?.jabatanPicAsal || [],
      jabatanPicTujuan: params?.jabatanPicTujuan || [],
      jenisReassignment: (params?.jenisReassignment || []).map((val) => Number(val)),
      namaCustomer: params?.namaCustomer || [],
      namaPicAsal: params?.namaPicAsal || [],
      namaPicTujuan: params?.namaPicTujuan || [],
      namaProcess: params?.namaProcess || [],
      statusReassignment: params?.statusReassignment ? Number(params?.statusReassignment) : '',
      tanggalMulai: startDate,
      tanggalSelesai: (startDate && !endDate) ? formatDate(new Date(), 'YYYY-MM-DD') : endDate,
    };

    setSearchParams(searchPayload);
    setPage(1);
    setIsReset(false);
  };

  const handleRoleSearch = (value: string) => {
    if (value.length >= 3) {
      setRoleSearchValue(value);
    } else {
      setRoleSearchValue('');
    }
  };

  return {
    canDownloadFile,
    customerOptions,
    data,
    handleClear,
    handleDownloadExcel,
    handleDownloadPDF,
    handleRoleSearch,
    handleSearch,
    isLoading,
    isLoadingCustomer,
    isLoadingPicName: isLoadingUsername,
    isLoadingProcess,
    isLoadingRole,
    jenisReassignmentOptions,
    page,
    processOptions,
    roleOptions,
    searchParams,
    setPage,
    setPageSize,
    statusReassignmentOptions,
    tableHeader,
    totalPage,
    usernameOptions,
  };
};

export default useTabListData;
