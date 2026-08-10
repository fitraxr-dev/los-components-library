import type { TableHeader } from '@/components/shared/Table/Table.types';


export const action = {
  TABLE_UPLOAD_DOCUMENT_DELETE: 'TABLE_UPLOAD_DOCUMENT_DELETE',
  TABLE_UPLOAD_DOCUMENT_DOWNLOAD: 'TABLE_UPLOAD_DOCUMENT_DOWNLOAD',
  TABLE_UPLOAD_DOCUMENT_EDIT: 'TABLE_UPLOAD_DOCUMENT_EDIT',
  TABLE_UPLOAD_DOCUMENT_PREVIEW: 'TABLE_UPLOAD_DOCUMENT_PREVIEW',
};

export const modal = {
  DOCUMENT_DETAIL: 'DOCUMENT_DETAIL',
  MODAL_UPLOAD_DOCUMENT: 'MODAL_UPLOAD_DOCUMENT',
  MODAL_UPLOAD_DOCUMENT_EXISTING: 'MODAL_UPLOAD_DOCUMENT_EXISTING',
};

export const TABLE_HEADER_UPLOAD_DOCUMENT: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'documentGroupLabel',
    label: 'Group Dokumen',
    sx: { minWidth: '19vw' },
  },
  {
    key: 'documentTypeLabel',
    label: 'Jenis Dokumen',
    sx: { minWidth: '20vw' },
  },
  {
    key: 'fileName',
    label: 'Nama Dokumen',
    sx: { minWidth: '25vw' },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: { minWidth: '13vw' },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    sx: { minWidth: '11vw' },
    type: 'date-only',
  },
  {
    key: 'createdBy',
    label: 'Uploaded By',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'divisionLabel',
    label: 'Divisi',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'createdDate',
    label: 'Uploaded Date',
    sx: { minWidth: '10vw' },
    type: 'date',
  },
];
