import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'bucketMaster',
    label: 'Master ID',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'id',
    label: 'ID',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'institutionTypeLabel',
    label: 'Tipe Institusi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'staffDivisionLabel',
    label: 'Divisi',
    sx: { minWidth: '15vw' },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: { minWidth: '10vw' },
  },
];
