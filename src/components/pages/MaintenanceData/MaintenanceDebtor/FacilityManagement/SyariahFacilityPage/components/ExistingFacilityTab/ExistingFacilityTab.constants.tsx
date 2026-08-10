import { formatDate } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'processId',
    label: 'ID Process',
    render: (data) => (
      <TextStyle>{data.processId ?? '-'}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'parentFacilityCode',
    label: 'Kode Induk',
    render: (data) => (
      <TextStyle>{!data.parentFacilityCode || data.parentFacilityCode === '' ? '-' : data.parentFacilityCode}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'parentFacilityId',
    label: 'Fasilitas Induk ID',
    render: (data) => (
      <TextStyle>{(!data.parentFacilityId || data.parentFacilityId === '') ? '-' : data.parentFacilityId}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'childFacilityCode',
    label: 'Kode Anak',
    render: (data) => (
      <TextStyle>{data.childFacilityCode ?? '-'}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'childFacilityId',
    label: 'Fasilitas Anak ID',
    render: (data) => (
      <TextStyle>{!data.childFacilityId || data.childFacilityId === '' ? '-' : data.childFacilityId}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'productLabel',
    label: 'Financial Scheme',
    render: (data) => (
      <TextStyle>{data.productLabel ?? '-'}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'akad',
    label: 'Akad',
    render: (data) => (
      <TextStyle>{(data?.akad === '' || !data?.akad) ? '-' : data?.akad}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'activationDate',
    label: 'Activation Date',
    render: (data) => (
      <TextStyle>{(!data.activationDate || data.activationDate === '') ? '-' : formatDate(data.activationDate)}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'currencyOrderValue',
    label: 'Mata Uang',
    render: (data) => (
      <TextStyle>{data.currencyOrderValue ?? '-'}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'orderValue',
    label: 'Plafond',
    render: (data) => (
      <TextStyle>{(!data.orderValue || data.orderValue === '') ? '-' : formatCurrency(data.orderValue.toString())}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'outstanding',
    label: 'O/S',
    render: (data) => (
      <TextStyle>{(!data.outstanding || data.outstanding === '') ? '-' : formatCurrency(data.outstanding.toString())}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'accountOfficer',
    label: 'PIC',
    render: (data) => (
      <TextStyle>{data.accountOfficer ?? '-'}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
];

export const mockTableData = [
  {
    activationDate: '24 Aug 2025',
    applicationNumber: 'Syar-001',
    childFacilityCode: '-',
    childFacilityId: '-',
    childFacilityNumber: '-',
    contract: 'Entahlah',
    currency: 'Rupiah',
    financialScheme: '-',
    masterCode: 'Ind-001',
    masterFacilityId: 'Ind-001',
    masterFacilityNumber: 'Ind-001',
    os: 'Gatau',
    pic: 'Gakenal',
    plafond: 'Rp.350.000',
    processId: 'MNT-001',
    project: 'Gatau',
    statusLabel: 'Approved',
  },
  {
    activationDate: '24 Aug 2025',
    applicationNumber: 'Syar-002',
    childFacilityCode: 'Chd-001',
    childFacilityId: 'Chd-001',
    childFacilityNumber: 'Chd-001',
    contract: 'Entahlah',
    currency: 'Rupiah',
    financialScheme: '-',
    masterCode: '-',
    masterFacilityId: '-',
    masterFacilityNumber: '-',
    os: 'Gatau',
    pic: 'Gakenal',
    plafond: 'Rp.350.000',
    processId: 'MNT-002',
    project: 'Gatau',
    statusLabel: 'Approved',
  },
];
