import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'callType',
    label: 'CL/NCL',
    sx: {
      minWidth: '6vw',
    },
  },
  {
    key: 'totalPlafond',
    label: 'Total Plafond',
    sx: {
      minWidth: '6vw',
    },
  },
  {
    key: 'totalOS',
    label: 'Total OS',
    sx: {
      minWidth: '6vw',
    },
  },
];
