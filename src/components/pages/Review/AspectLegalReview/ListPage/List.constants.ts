import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: Array<TableHeader> = [
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
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'bucketProcessId',
    label: 'ID',
    sx: {
      minWidth: '7.5vw',
    },
  },
  {
    key: 'institutionTypeLabel',
    label: 'Tipe Institusi',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: { minWidth: '14vw' },
  },
  {
    key: 'staffDivisionLabel',
    label: 'Divisi',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: { minWidth: '14vw' },
  },
];
