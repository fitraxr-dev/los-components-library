import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_PAYMENT_FACILITY_EXISTING: Array<TableHeader> = [
  {
    key: 'id',
    label: 'No',
    type: 'index',
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
  },
  {
    key: 'financingSegment',
    label: 'Segmen Pembiayaan',
  },
  {
    key: 'productLabel',
    label: 'Produk',
  },
  {
    key: 'orderValue',
    label: 'Plafond',
  },
  {
    key: 'outstanding',
    label: 'O/S',
  },
  {
    key: 'projectName',
    label: 'Proyek',
  },
  {
    key: 'exchangeRate',
    label: 'Rate',
  },
  {
    key: 'locationProjectLabel',
    label: 'Lokasi Proyek',
  },
  {
    key: 'collectivity',
    label: 'Kolektibilitas',
  },
];
