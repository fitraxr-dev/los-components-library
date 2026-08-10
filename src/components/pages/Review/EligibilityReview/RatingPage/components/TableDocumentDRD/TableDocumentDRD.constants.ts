import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_LIST: Array<TableHeader> = [

  {
    key: 'documentGroupLabel',
    label: 'Group Dokumen',
    sx: { minWidth: '17.5vw' },
  },
  {
    key: 'documentTypeLabel',
    label: 'Jenis Dokumen',
    sx: { minWidth: '12.5vw' },
  },
  {
    key: 'fileName',
    label: 'Nama Dokumen',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: { minWidth: '9vw' },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    sx: { minWidth: '12.5vw' },
  },
  {
    key: 'createdBy',
    label: 'Uploaded By',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'divisionLabel',
    label: 'Divisi',
    sx: { minWidth: '16.5vw' },
  },
  {
    key: 'createdDate',
    label: 'Uploaded Date',
    sx: { minWidth: '12.5vw' },
  },
  {
    key: 'status',
    label: 'Status',
    sx: { minWidth: '7.5vw' },
  },
];


export const modal = {
  DOCUMENT_DETAIL: 'DOCUMENT_DETAIL',
  MODAL_UPLOAD_DOCUMENT: 'MODAL_UPLOAD_DOCUMENT',
  MODAL_UPLOAD_DOCUMENT_EXISTING: 'MODAL_UPLOAD_DOCUMENT_EXISTING',
};
