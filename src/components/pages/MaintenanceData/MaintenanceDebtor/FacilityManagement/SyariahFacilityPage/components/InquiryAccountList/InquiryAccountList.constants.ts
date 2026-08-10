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
    key: 'debtorName',
    label: 'Nama Nasabah',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'noVa',
    label: 'Nomor Virtual Account Nasabah',
    sx: {
      minWidth: '4vw',
    },
  },
];
