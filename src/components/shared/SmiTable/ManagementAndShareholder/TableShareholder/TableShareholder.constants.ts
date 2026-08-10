import type { TableHeader } from '@/components/shared/Table/Table.types';


export const DROPDOWN_TYPE = [
  {
    label: 'Badan Usaha',
    value: 'BUSINESS_ENTITY',
  },
  {
    label: 'Perorangan',
    value: 'INDIVIDUAL',
  },
];

export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'typeLabel',
    label: 'Tipe',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'shares',
    label: 'Lembar Saham',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'percentage',
    label: '%',
    sx: { minWidth: '12vw' },
  },
];

export const TABLE_HEADER_LIST_CREDIT_CHECKING: TableHeader[] = [
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
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'collectabilityLabel',
    label: 'Kolektibilitas',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const TABLE_HEADER_RESULT_LIST: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'type',
    label: 'Tipe',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'collectibility',
    label: 'Kolektibilitas',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const tableHeaderListDocumentVerification: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'type',
    label: 'Tipe',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'nik',
    label: 'NIK',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'shares',
    label: 'Lembar Saham',
    sx: {
      minWidth: '8vw',
    },
  },
];

export const tableHeaderListSummary: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'type',
    label: 'Tipe',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'collectibility',
    label: 'Kolektibilitas',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const tableHeaderListMIP: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'type',
    label: 'Tipe',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'collectibility',
    label: 'Kolektibilitas',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const tableHeaderListUploadResult: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'type',
    label: 'Tipe',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'nik',
    label: 'NIK',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'shares',
    label: 'Lembar Saham',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const tableHeaderListRequest: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'type',
    label: 'Tipe',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'nik',
    label: 'NIK',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'shares',
    label: 'Lembar Saham',
    sx: {
      minWidth: '10vw',
    },
  },

];
