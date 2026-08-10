import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '3vw' },
    type: 'index',
  },
  {
    key: 'bucketMaster',
    label: 'Master ID',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'bucketProcessId',
    label: 'ID',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'institutionTypeLabel',
    label: 'Institution Type',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: { minWidth: '9vw' },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: { minWidth: '9vw' },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: { minWidth: '9vw' },
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: { minWidth: '9vw' },
  },
  {
    key: 'statusLabel',
    label: 'Status',
    sx: { minWidth: '9vw' },
    type: 'status',
  },
];
