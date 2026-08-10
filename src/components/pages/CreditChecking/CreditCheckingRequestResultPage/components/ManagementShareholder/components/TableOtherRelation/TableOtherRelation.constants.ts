import type { TableHeader } from '@/components/shared/Table/Table.types';


export const MODAL_OTHER_RELATION = {
  OTHER_RELATION_DETAIL: 'MODAL_OTHER_RELATION_DETAIL',
};

export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'typeLabel',
    label: 'Tipe',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '10vw' },
  },
];

export const TABLE_HEADER_SUMMARY: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'typeLabel',
    label: 'Tipe',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'collectabilityLabel',
    label: 'Kolektibilitas',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'ref',
    label: 'Ref',
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
