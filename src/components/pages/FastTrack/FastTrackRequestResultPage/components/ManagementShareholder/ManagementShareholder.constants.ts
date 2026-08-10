import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  DEBTOR_DETAIL: 'DEBTOR_DETAIL',
  REQUEST_RELATION_DETAIL: 'REQUEST_RELATION_DETAIL',
  RESULT_RELATION_DETAIL: 'RESULT_RELATION_DETAIL',
  VERIFICATION_UPLOAD_DOCUMENT: 'VERIFICATION_UPLOAD_DOCUMENT',
};

export const tab = {
  DEBTOR: 'debtor',
  MANAGEMENT: 'management',
  OTHER_RELATION: 'others',
  SHAREHOLDER: 'shareholder',
};

export const TAB_ITEMS = [
  { label: 'Customer', value: tab.DEBTOR },
  { label: 'Shareholder', value: tab.SHAREHOLDER },
  { label: 'Manajemen', value: tab.MANAGEMENT },
  { label: 'Pihak Terkait Lainnya', value: tab.OTHER_RELATION },
];

export const DEBTOR_LIST_MOCK = [
  {
    label: 'Sulis',
    value: '1',
  },
  {
    label: 'Endang',
    value: '1',
  },
  {
    label: 'Sri',
    value: '2',
  },
];


export const TABLE_HEADER_FAST_TRACK: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'group',
    label: 'Group Dokumen',
    sx: { width: '15%' },
  },
  {
    key: 'type',
    label: 'Jenis Dokumen',
    sx: { width: '15%' },
  },
  {
    key: 'name',
    label: 'Nama Dokumen',
    sx: { width: '15%' },
  },
  {
    key: 'upload',
    label: 'Upload Dokumen',
    sx: { width: '15%' },
  },
  {
    key: 'number',
    label: 'Nomor Dokumen',
    sx: { width: '15%' },
  },
  {
    key: 'date',
    label: 'Tanggal Dokumen',
    sx: { width: '15%' },
  },
];
