import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      maxWidth: '10px',
      minWidth: '10px',
    },
    type: 'index',
  },
  {
    key: 'cif',
    label: 'CIF',
    sx: {
      maxWidth: '20px',
      minWidth: '10px',
    },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      maxWidth: '30px',
      minWidth: '10px',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      maxWidth: '30px',
      minWidth: '10px',
    },
  },
  {
    key: 'rmName',
    label: 'Nama Staff',
    sx: {
      maxWidth: '30px',
      minWidth: '10px',
    },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: {
      maxWidth: '30px',
      minWidth: '10px',
    },
  },
  {
    key: 'gamName',
    label: 'General Account Manager',
    sx: {
      maxWidth: '50px',
      minWidth: '10px',
    },
  },
];
