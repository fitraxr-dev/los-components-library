import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_LIST: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '3.5vw' },
    type: 'index',
  },
  {
    key: 'orderTypeLabel',
    label: 'Order Type',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
    sx: { minWidth: '9.5vw' },
  },
  {
    key: 'productLabel',
    label: 'Produk',
    sx: { minWidth: '9.5vw' },
  },
  {
    key: 'orderValue',
    label: 'Nominal',
    sx: { minWidth: '9.5vw' },
  },
  {
    key: 'timePeriod',
    label: 'Jangka Waktu',
    sx: { minWidth: '9.5vw' },
  },
  {
    key: 'projectName',
    label: 'Proyek',
    sx: { minWidth: '9.5vw' },
  },
];
