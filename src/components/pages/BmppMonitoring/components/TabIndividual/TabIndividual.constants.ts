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
    key: 'cif',
    label: 'CIF',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'typeDebtor',
    label: 'Jenis Customer',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'isRelatedSmi',
    label: 'Terkait SMI',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'gamName',
    label: 'General Account Manager',
    sx: {
      minWidth: '10vw',
    },
  },
];
