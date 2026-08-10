import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderSelectedTask: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'id',
    label: 'ID',
    sx: {
      width: '50%',
    },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      width: '45%',
    },
  }
];
