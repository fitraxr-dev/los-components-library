import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '14vw' },
  },
  {
    key: 'code',
    label: 'Kode',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'profile',
    label: 'Profil',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'birthPlace',
    label: 'Tempat Lahir',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'birthDate',
    label: 'Tanggal Lahir',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'nationality',
    label: 'Warga Negara',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'keterangan',
    label: 'Keterangan',
    sx: { minWidth: '10vw' },
  },
];

export const tab = {
  DPPSPM: 'DPPSPM',
  DTTOT: 'DTTOT',
};

export const tabItems = [
  {
    label: 'DPPSPM',
    value: tab.DPPSPM,
  },
  {
    label: 'DTTOT',
    value: tab.DTTOT,
  },
];
