import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'bankName',
    label: 'Bank',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'currency',
    label: 'Currency',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'vaType',
    label: 'VA Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'customerType',
    label: 'Customer Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'noVA',
    label: 'No VA',
    sx: {
      minWidth: '8vw',
    },
  },

];
