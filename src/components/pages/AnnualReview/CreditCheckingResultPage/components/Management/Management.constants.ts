import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  MODAL_MANAGEMENT_DETAIL: 'MODAL_MANAGEMENT_DETAIL',
};

export const tableHeaderList: Array<TableHeader> = [
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
  {
    key: 'npwp',
    label: 'NPWP',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'collectability',
    label: 'Koletikbilitas',
    sx: { minWidth: '8vw' },
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
