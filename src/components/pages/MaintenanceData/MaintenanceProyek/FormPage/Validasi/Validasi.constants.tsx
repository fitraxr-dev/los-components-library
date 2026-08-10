import type { TableHeader } from '@/components/shared/Table/Table.types';


export const ValidasiTableHeader: TableHeader[] = [
  {
    key: 'createdBy',
    label: 'Created By',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'createdDate',
    label: 'Tanggal',
    sx: {
      minWidth: '7vw',
    },
  },
];
