import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  MODAL_OTHER_RELATION_DETAIL: 'MODAL_OTHER_RELATION_DETAIL',
};

export const tableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'type',
    label: 'Tipe',
    sx: { minWidth: '10vw' },
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
    key: 'collectibility',
    label: 'Kolektabilitas',
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
