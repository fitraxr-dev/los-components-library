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
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '10vw' },
  },
  // {
  //   key: 'npwp',
  //   label: 'NPWP',
  //   sx: { minWidth: '10vw' },
  // },
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
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '10vw' },
  },
  // {
  //   key: 'npwp',
  //   label: 'NPWP',
  //   sx: { minWidth: '10vw' },
  // },
];

export const tableHeaderListSummary: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '10vw' },
  },
  // {
  //   key: 'npwp',
  //   label: 'NPWP',
  //   sx: { minWidth: '10vw' },
  // },
  {
    key: 'collectibility',
    label: 'Kolektibilitas',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: { minWidth: '10vw' },
  },
];


export const tableHeaderListMIP: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '10vw' },
  },
  // {
  //   key: 'npwp',
  //   label: 'NPWP',
  //   sx: { minWidth: '10vw' },
  // },
  {
    key: 'collectibility',
    label: 'Kolektibilitas',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: { minWidth: '10vw' },
  },
];


export const DROPDOWN_JABATAN = [
  {
    label: 'Direktur Keuangan',
    value: 'DIRUT',
  },
  {
    label: 'Office Boy',
    value: 'OB',
  },
];
