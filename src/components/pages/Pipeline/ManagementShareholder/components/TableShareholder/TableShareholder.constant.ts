import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'institutionTypeLabel',
    label: 'Tipe',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'shares',
    label: 'Lembar Saham',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'percentage',
    label: '%',
    sx: { minWidth: '9vw' },
  },
];
