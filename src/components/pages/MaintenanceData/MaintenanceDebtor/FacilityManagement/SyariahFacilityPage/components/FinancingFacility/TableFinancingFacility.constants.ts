import type { TableHeader } from '@/components/shared/Table/Table.types';


export const financingFacilityHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'facilityIdSequenceCode',
    label: 'ID Fasilitas',
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
    key: 'mappingOrderType',
    label: 'Mapping Order Type',
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
    key: 'coreMappingProduct',
    label: 'CORE Mapping Segmen Pembiayaan',
    sx: {
      minWidth: '15vw',
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
];
