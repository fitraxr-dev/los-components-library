import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_LIST: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'id',
    label: 'ID',
    sx: {
      minWidth: '7.5vw',
    },
  },
  {
    key: 'cif',
    label: 'CIF Kelompok',
    sx: {
      minWidth: '7.5vw',
    },
  },
  {
    key: 'orderValue',
    label: 'Nominal Fasilitas',
    sx: {
      minWidth: '14.5vw',
    },
  },
  {
    key: 'maximalPenggunaan',
    label: 'Maksimal Penggunaan',
    sx: {
      minWidth: '12.5vw',
    },
  },
  {
    key: 'tanggalBerlaku',
    label: 'Tanggal Berlaku',
    sx: {
      minWidth: '19.5vw',
    },
    type: 'date-only',
  },
  {
    key: 'frekuensiReview',
    label: 'Frekuensi Review',
    sx: {
      minWidth: '12.5vw',
    },
  },
];
