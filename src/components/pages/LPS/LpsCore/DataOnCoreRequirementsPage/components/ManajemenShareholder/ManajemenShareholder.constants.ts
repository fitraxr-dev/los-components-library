import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_SHAREHOLDER: TableHeader[] = [
  {
    key: 'no',
    label: 'No',
    sx: { minWidth: '1vw' },
    type: 'index',
  },
  {
    key: 'institutionTypeLabel',
    label: 'Tipe',
    sx: { minWidth: '9vw' },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'sheets',
    label: 'Lembar Saham',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'percentage',
    label: '%',
    sx: { minWidth: '1vw' },
  },
];


export const DATA_DUMMY_DEBTOR = [
  {
    name: 'PT. ABC',
    no: 1,
    percentage: '50',
    shareholderId: 'shr-001',
    shares: 'Gatau',
    typeLabel: 'Gatau',
  },
  {
    name: 'PT. DEF',
    no: 2,
    percentage: '50',
    shareholderId: 'shr-002',
    shares: 'Gatau',
    typeLabel: 'Gatau',
  },
];


export const TABLE_MANAGEMENT: TableHeader[] = [
  {
    key: 'no',
    label: 'No',
    sx: { minWidth: '1vw' },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
    sx: {
      minWidth: '12vw',
    },
  },
];

export const DATA_DUMMY_MANAGEMENT = [
  {
    jobPositionLabel: 'Manager',
    managementCode: 'MNG-001',
    name: 'John Doe',
    nik: '1234567890',
    no: 1,
  },
  {
    jobPositionLabel: 'Manager',
    managementCode: 'MNG-002',
    name: 'Jane Doe',
    nik: '1234567890',
    no: 2,
  },
];
