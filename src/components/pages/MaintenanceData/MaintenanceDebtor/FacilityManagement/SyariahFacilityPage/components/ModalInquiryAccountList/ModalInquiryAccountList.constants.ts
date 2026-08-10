import type { TableHeader } from '@/components/shared/TableV2/Table.types';


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
    key: 'customerName',
    label: 'Nama Nasabah',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'accountNumber',
    label: 'No. Virtual Account',
    sx: {
      minWidth: '4vw',
    },
  },
];
