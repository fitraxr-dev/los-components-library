import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'no',
    label: 'No',
  },
  {
    key: 'address',
    label: 'Alamat',
  },
  {
    key: 'province',
    label: 'Provinsi',
  },
  {
    key: 'city',
    label: 'Kota - Kabupaten',
  },
  {
    key: 'district',
    label: 'Kecamatan',
  },
  {
    key: 'subDistrict',
    label: 'Kelurahan',
  },
  {
    key: 'postalCode',
    label: 'Kode Pos',
  },
];


export const DATA_DUMMY = [
  {
    address: 'Jl. ABC',
    city: 'Jakarta',
    district: 'Jakarta Pusat',
    no: 1,
    postalCode: '12345',
    province: 'DKI Jakarta',
    subDistrict: 'Gambir',
  },
  {
    address: 'Jl. DEF',
    city: 'Jakarta',
    district: 'Jakarta Pusat',
    no: 2,
    postalCode: '12345',
    province: 'DKI Jakarta',
    subDistrict: 'Gambir',
  },
];
