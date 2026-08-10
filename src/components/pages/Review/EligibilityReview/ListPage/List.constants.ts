import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: Array<TableHeader> = [
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      minWidth: '14vw',
    },
  },
  {
    key: 'staffDivisionLabel',
    label: 'Divisi',
    sx: { minWidth: '12.5vw' },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: {
      minWidth: '14vw',
    },
  }
];
