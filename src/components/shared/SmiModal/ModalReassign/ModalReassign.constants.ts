import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderSelectedTask: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '3vw',
    },
    type: 'index',
  },
  {
    key: 'id',
    label: 'ID',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
