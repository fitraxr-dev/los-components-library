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
    key: 'orderTypeLabel',
    label: 'Order Type',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'productLabel',
    label: 'Produk',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'orderValue',
    label: 'Nominal',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'timePeriod',
    label: 'Jangka Waktu',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'projectName',
    label: 'Proyek',
    sx: {
      minWidth: '8vw',
    },
  },
];
