import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_LIST: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'orderTypeLabel',
    label: 'Order Type',
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
  },
  {
    key: 'productLabel',
    label: 'Produk',
  },
  {
    key: 'orderValue',
    label: 'Nominal',
  },
  {
    key: 'projectName',
    label: 'Proyek',
  },
  {
    key: 'valueProject',
    label: 'Nilai Proyek',
  },
  {
    key: 'locationProject',
    label: 'Lokasi Proyek',
  },
  {
    key: 'remark',
    label: 'Keterangan',
  }
];
