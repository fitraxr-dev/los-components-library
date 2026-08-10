import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_LIST: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
    sx: {
      minWidth: '7.5vw',
    },
  },
  {
    key: 'orderTypeLabel',
    label: 'Order Type',
    sx: {
      minWidth: '7.5vw',
    },
  },
  {
    key: 'mappingOrderTypeLabel',
    label: 'Mapping Order Type',
    sx: {
      minWidth: '14.5vw',
    },
  },
  {
    key: 'financingSegmentLabel',
    label: 'Segmen Pembiayaan',
    sx: {
      minWidth: '12.5vw',
    },
  },
  {
    key: 'mappingFinancingSegmentLabel',
    label: 'CORE Mapping Segmen Pembiayaan',
    sx: {
      minWidth: '19.5vw',
    },
  },
  {
    key: 'productLabel',
    label: 'Produk/Skema Pembiayaan',
    sx: {
      minWidth: '12.5vw',
    },
  },
  {
    key: 'totalOrderValue',
    label: 'Nominal',
    sx: {
      minWidth: '12.5vw',
    },
  },
  {
    key: 'timePeriod',
    label: 'Jangka Waktu',
    sx: {
      minWidth: '10.5vw',
    },
  },
  {
    key: 'projectName',
    label: 'Proyek',
    sx: {
      minWidth: '10.5vw',
    },
  },
];
