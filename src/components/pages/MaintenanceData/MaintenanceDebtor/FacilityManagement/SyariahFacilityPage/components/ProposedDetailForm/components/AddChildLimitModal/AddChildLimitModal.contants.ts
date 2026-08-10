import type { TableHeader } from '@/components/shared/Table/Table.types';


export const childModalTableList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'facilityNo',
    label: 'No. Fasilitas',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'orderType',
    label: 'Order Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'productLabel',
    label: 'Produk',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'orderValue',
    label: 'Nominal',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'timePeriod',
    label: 'Jangka Waktu',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'projectName',
    label: 'Proyek',
    sx: {
      minWidth: '12vw',
    },
  },

  {
    key: 'financingSegment',
    label: 'Segmen Pembiayaan',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'mappingOrderType',
    label: 'Mapping Order Type',
    sx: {
      minWidth: '12vw',
    },
  },

];
