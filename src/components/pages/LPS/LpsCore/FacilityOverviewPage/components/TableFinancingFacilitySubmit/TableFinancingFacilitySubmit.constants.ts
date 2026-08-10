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
      minWidth: '12.5vw',
    },
  },
  {
    key: 'financingSegmentLabel',
    label: 'Segmen Pembiayaan',
    sx: {
      minWidth: '9.5vw',
    },
  },
  {
    key: 'mappingFinancingSegmentLabel',
    label: 'CORE Mapping Segmen Pembiayaan',
    sx: {
      minWidth: '12.5vw',
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
    key: 'orderValue',
    label: 'Nominal',
    sx: {
      minWidth: '13.5vw',
    },
  },
  {
    key: 'orderValuePk',
    label: 'Nominal dari PK',
    sx: {
      minWidth: '13.5vw',
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
  // {
  //   key: 'valueProject',
  //   label: 'Nilai Proyek',
  //   sx: {
  //     minWidth: '12.5vw',
  //   },
  // },
  // {
  //   key: 'locationProjectLabel',
  //   label: 'Lokasi Proyek',
  //   sx: {
  //     minWidth: '12.5vw',
  //   },
  // },
  // {
  //   key: 'remark',
  //   label: 'Keterangan',
  //   sx: {
  //     minWidth: '12.5vw',
  //   },
  // },
];
