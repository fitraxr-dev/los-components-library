'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelLaporanDetailCustomer from '@/hooks/services/report/laporan-detail-customer/useGenerateReportExcelLaporanDetailCustomer';
import useGenerateReportPDFLaporanDetailCustomer from '@/hooks/services/report/laporan-detail-customer/useGenerateReportPDFLaporanDetailCustomer';
import useGetDataReportLaporanDetailCustomer from '@/hooks/services/report/laporan-detail-customer/useGetDataReportLaporanDetailCustomer';
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
  const [sort, setSort] = useState<string>('customerId');
  const [totalPage, setTotalPage] = useState(1);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const { recordActivity } = useRecordLog();

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.LAPORAN_CUSTOMER_CUSTOMER_DOWNLOAD);

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

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportLaporanDetailCustomer(
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
  const { mutate: generateExcel } = useGenerateReportExcelLaporanDetailCustomer({
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
        remarks: 'generate download excel report laporan detail customer',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFLaporanDetailCustomer({
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
        remarks: 'generate download pdf report laporan detail customer',
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
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'alias',
      label: 'Alias',
      onSort: () => handleSort('alias'),
      sortDirection: sort === 'alias' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'keteranganCustomer',
      label: 'Keterangan Customer',
      onSort: () => handleSort('keteranganCustomer'),
      sortDirection: sort === 'keteranganCustomer' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'newExistingClient',
      label: 'New/Existing Client',
      onSort: () => handleSort('newExistingClient'),
      sortDirection: sort === 'newExistingClient' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'institutionType',
      label: 'Institution Type',
      onSort: () => handleSort('institutionType'),
      sortDirection: sort === 'institutionType' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'sektorIndustriCustomer',
      label: 'Sektor Industri Customer',
      onSort: () => handleSort('sektorIndustriCustomer'),
      sortDirection: sort === 'sektorIndustriCustomer' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'defineSector',
      label: 'Define Sector',
      onSort: () => handleSort('defineSector'),
      sortDirection: sort === 'defineSector' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'customerType',
      label: 'Customer Type',
      onSort: () => handleSort('customerType'),
      sortDirection: sort === 'customerType' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'customerCategory',
      label: 'Customer Category',
      onSort: () => handleSort('customerCategory'),
      sortDirection: sort === 'customerCategory' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'highRisk',
      label: 'High Risk',
      onSort: () => handleSort('highRisk'),
      sortDirection: sort === 'highRisk' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'statusHighRiskDate',
      label: 'Status High Risk Date',
      onSort: () => handleSort('statusHighRiskDate'),
      sortDirection: sort === 'statusHighRiskDate' ? order : false,
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'melampauiBmpkBmpdBmppIndividual',
      label: 'Melampaui BMPK/BMP/BMP Individual',
      onSort: () => handleSort('melampauiBmpkBmpdBmppIndividual'),
      sortDirection: sort === 'melampauiBmpkBmpdBmppIndividual' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'dataMelampauiBmpkBmpdBmppAsOf',
      label: 'Data Melampaui BMPK/BMP/BMP as of',
      onSort: () => handleSort('dataMelampauiBmpkBmpdBmppAsOf'),
      sortDirection: sort === 'dataMelampauiBmpkBmpdBmppAsOf' ? order : false,
      sx: { minWidth: '15vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'dataSource',
      label: 'Data Source',
      onSort: () => handleSort('dataSource'),
      sortDirection: sort === 'dataSource' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'alamatKedudukan',
      label: 'Alamat Kedudukan',
      onSort: () => handleSort('alamatKedudukan'),
      sortDirection: sort === 'alamatKedudukan' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'negara',
      label: 'Negara',
      onSort: () => handleSort('negara'),
      sortDirection: sort === 'negara' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'lokasiProvinsi',
      label: 'Lokasi (Provinsi)',
      onSort: () => handleSort('lokasiProvinsi'),
      sortDirection: sort === 'lokasiProvinsi' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'lokasiKotaKabupaten',
      label: 'Lokasi (Kota/kabupaten)',
      onSort: () => handleSort('lokasiKotaKabupaten'),
      sortDirection: sort === 'lokasiKotaKabupaten' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'lokasiKecamatan',
      label: 'Lokasi (Kecamatan)',
      onSort: () => handleSort('lokasiKecamatan'),
      sortDirection: sort === 'lokasiKecamatan' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'lokasiKelurahan',
      label: 'Lokasi (Kelurahan)',
      onSort: () => handleSort('lokasiKelurahan'),
      sortDirection: sort === 'lokasiKelurahan' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'postalCode',
      label: 'Postal Code',
      onSort: () => handleSort('postalCode'),
      sortDirection: sort === 'postalCode' ? order : false,
      sx: { minWidth: '8vw' },
    },
    {
      isSortable: true,
      key: 'telephone',
      label: 'Telepon',
      onSort: () => handleSort('telephone'),
      sortDirection: sort === 'telephone' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'officerSeluler',
      label: 'Officer Seluler',
      onSort: () => handleSort('officerSeluler'),
      sortDirection: sort === 'officerSeluler' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'alamatEmail',
      label: 'Alamat Email',
      onSort: () => handleSort('alamatEmail'),
      sortDirection: sort === 'alamatEmail' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'customerWebsite',
      label: 'Customer Website',
      onSort: () => handleSort('customerWebsite'),
      sortDirection: sort === 'customerWebsite' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'contactPerson',
      label: 'Contact Person',
      onSort: () => handleSort('contactPerson'),
      sortDirection: sort === 'contactPerson' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'jabatanContactPerson',
      label: 'Jabatan Contact Person',
      onSort: () => handleSort('jabatanContactPerson'),
      sortDirection: sort === 'jabatanContactPerson' ? order : false,
      sx: { minWidth: '12vw' },
    },
    {
      isSortable: true,
      key: 'emailContactPerson',
      label: 'Email Contact Person',
      onSort: () => handleSort('emailContactPerson'),
      sortDirection: sort === 'emailContactPerson' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'nomorContactPersonOffice',
      label: 'Nomor Contact Person - Office',
      onSort: () => handleSort('nomorContactPersonOffice'),
      sortDirection: sort === 'nomorContactPersonOffice' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'nomorContactPersonSeluler',
      label: 'Nomor Contact Person - Seluler',
      onSort: () => handleSort('nomorContactPersonSeluler'),
      sortDirection: sort === 'nomorContactPersonSeluler' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'status',
      label: 'Status',
      onSort: () => handleSort('status'),
      sortDirection: sort === 'status' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'totalPembiayaanPerCustomer',
      label: 'Total Pembiayaan per Customer',
      onSort: () => handleSort('totalPembiayaanPerCustomer'),
      sortDirection: sort === 'totalPembiayaanPerCustomer' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'porsiPembiayaanSmiPerCustomer',
      label: 'Porsi Pembiayaan SMI - per Customer',
      onSort: () => handleSort('porsiPembiayaanSmiPerCustomer'),
      sortDirection: sort === 'porsiPembiayaanSmiPerCustomer' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'informasiBerelasi',
      label: 'Informasi berelasi',
      onSort: () => handleSort('informasiBerelasi'),
      sortDirection: sort === 'informasiBerelasi' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'terafiliasiDenganSmi',
      label: 'Terafiliasi dengan SMI',
      onSort: () => handleSort('terafiliasiDenganSmi'),
      sortDirection: sort === 'terafiliasiDenganSmi' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'tahunDidirikan',
      label: 'Tahun Didirikan',
      onSort: () => handleSort('tahunDidirikan'),
      sortDirection: sort === 'tahunDidirikan' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'jenisSektorUsaha',
      label: 'Jenis Sektor Usaha',
      onSort: () => handleSort('jenisSektorUsaha'),
      sortDirection: sort === 'jenisSektorUsaha' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'hubunganDenganPtSmi',
      label: 'Hubungan dengan PT SMI',
      onSort: () => handleSort('hubunganDenganPtSmi'),
      sortDirection: sort === 'hubunganDenganPtSmi' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'detailHubunganDenganPtSmi',
      label: 'Detail Hubungan dengan PT SMI',
      onSort: () => handleSort('detailHubunganDenganPtSmi'),
      sortDirection: sort === 'detailHubunganDenganPtSmi' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'coBorrowerStatus',
      label: 'Co-Borrower Status',
      onSort: () => handleSort('coBorrowerStatus'),
      sortDirection: sort === 'coBorrowerStatus' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'viewCoBorrower',
      label: 'View Co-Borrower',
      onSort: () => handleSort('viewCoBorrower'),
      sortDirection: sort === 'viewCoBorrower' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'nomorIzinDariInstansiBerwenang',
      label: 'Nomor Izin dari Instansi Berwenang',
      onSort: () => handleSort('nomorIzinDariInstansiBerwenang'),
      sortDirection: sort === 'nomorIzinDariInstansiBerwenang' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'bidangUsahaKegiatanUsaha',
      label: 'Bidang Usaha / Kegiatan Usaha',
      onSort: () => handleSort('bidangUsahaKegiatanUsaha'),
      sortDirection: sort === 'bidangUsahaKegiatanUsaha' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'tempatDanTanggalPendirian',
      label: 'Tempat dan tanggal pendirian',
      onSort: () => handleSort('tempatDanTanggalPendirian'),
      sortDirection: sort === 'tempatDanTanggalPendirian' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'bentukUsaha',
      label: 'Bentuk Usaha',
      onSort: () => handleSort('bentukUsaha'),
      sortDirection: sort === 'bentukUsaha' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'terdaftarDalamBursaEfek',
      label: 'Terdaftar dalam Bursa Efek',
      onSort: () => handleSort('terdaftarDalamBursaEfek'),
      sortDirection: sort === 'terdaftarDalamBursaEfek' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'pemilikManfaatUtama',
      label: 'Pemilik Manfaat Utama/ Ultimate Beneficial Owner',
      onSort: () => handleSort('pemilikManfaatUtama'),
      sortDirection: sort === 'pemilikManfaatUtama' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'sumberDana',
      label: 'Sumber Dana',
      onSort: () => handleSort('sumberDana'),
      sortDirection: sort === 'sumberDana' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'maksudDanTujuanHubunganUsaha',
      label: 'Maksud dan Tujuan Hubungan Usaha',
      onSort: () => handleSort('maksudDanTujuanHubunganUsaha'),
      sortDirection: sort === 'maksudDanTujuanHubunganUsaha' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'penghasilan',
      label: 'Penghasilan',
      onSort: () => handleSort('penghasilan'),
      sortDirection: sort === 'penghasilan' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'rekeningYangDimiliki',
      label: 'Rekening yang Dimiliki',
      onSort: () => handleSort('rekeningYangDimiliki'),
      sortDirection: sort === 'rekeningYangDimiliki' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'npwpNo',
      label: 'NPWP No.',
      onSort: () => handleSort('npwpNo'),
      sortDirection: sort === 'npwpNo' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'notaryDeedNo',
      label: 'Notary Deed No.',
      onSort: () => handleSort('notaryDeedNo'),
      sortDirection: sort === 'notaryDeedNo' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'firstNotaryDeedDate',
      label: 'First Notary Deed Date',
      onSort: () => handleSort('firstNotaryDeedDate'),
      sortDirection: sort === 'firstNotaryDeedDate' ? order : false,
      sx: { minWidth: '15vw' },
      type: 'date-only',
    },
    {
      isSortable: true,
      key: 'lastNotaryDeedNo',
      label: 'Last Notary Deed No.',
      onSort: () => handleSort('lastNotaryDeedNo'),
      sortDirection: sort === 'lastNotaryDeedNo' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'lastNotaryDeedDate',
      label: 'Last Notary Deed Date',
      onSort: () => handleSort('lastNotaryDeedDate'),
      sortDirection: sort === 'lastNotaryDeedDate' ? order : false,
      sx: { minWidth: '15vw' },
      type: 'date-only',
    },
    {
      isSortable: true,
      key: 'namaPicRm',
      label: 'Nama PIC RM',
      onSort: () => handleSort('namaPicRm'),
      sortDirection: sort === 'namaPicRm' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'divisi',
      label: 'Divisi',
      onSort: () => handleSort('divisi'),
      sortDirection: sort === 'divisi' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'tanggalMenjadiCustomer',
      label: 'Tanggal menjadi Customer',
      onSort: () => handleSort('tanggalMenjadiCustomer'),
      sortDirection: sort === 'tanggalMenjadiCustomer' ? order : false,
      sx: { minWidth: '15vw' },
      type: 'date',
    },
    {
      isSortable: true,
      key: 'gam',
      label: 'GAM',
      onSort: () => handleSort('gam'),
      sortDirection: sort === 'gam' ? order : false,
      sx: { minWidth: '10vw' },
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
      key: 'createdDate',
      label: 'Created Date',
      onSort: () => handleSort('createdDate'),
      sortDirection: sort === 'createdDate' ? order : false,
      sx: { minWidth: '10vw' },
      type: 'date',
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
    page,
    searchParams,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};

export default useTabListData;
