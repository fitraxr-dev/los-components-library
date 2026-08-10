import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  HISTORY_DRAFT_MEMO: 'HISTORY_DRAFT_MEMO',
};


export const TABLE_HEADER_DRAFT_MEMO: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'documentName',
    label: 'Nama Dokumen',
    sx: {
      maxWidth: '200px',
      wordBreak: 'break-word',
    },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
  },
  {
    key: 'createdBy',
    label: 'Created/Uploaded By',
  },
  {
    key: 'createdDate',
    label: 'Created/Uploaded Date',
  },
];


export const GENERATE = 'GENERATE_DRAFT';
export const MANUAL = 'MANUAL';
