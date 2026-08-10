import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'nik',
    label: 'NIK',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
    sx: {
      minWidth: '12vw',
    },
  },
];
