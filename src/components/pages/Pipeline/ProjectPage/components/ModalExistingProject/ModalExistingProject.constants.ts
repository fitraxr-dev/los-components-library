import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_LIST: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama Proyek',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'value',
    label: 'Nilai Proyek',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'sectorLabel',
    label: 'Sektor yang dibiayai',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'districtLabel',
    label: 'Lokasi Proyek (Kecamatan)',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'cityLabel',
    label: 'Lokasi Proyek (Kota - Kabupaten)',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'provinceLabel',
    label: 'Lokasi Proyek (Provinsi)',
    sx: {
      minWidth: '12vw',
    },
  },
];
