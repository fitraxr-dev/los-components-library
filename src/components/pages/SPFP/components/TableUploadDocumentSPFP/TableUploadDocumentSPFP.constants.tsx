import type { TableHeader } from '@/components/shared/Table/Table.types';


export const SUPPORTING_DOCUMENTS = 'SUPPORTING_DOCUMENTS';

export const TABLE_HEADER: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'documentType',
    label: 'Jenis Dokumen',
    sx: {
      maxWidth: '180px',
    },
  },
  {
    key: 'documentName',
    label: 'Nama Dokumen',
    sx: {
      maxWidth: '180px',
    },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
  },
];

export const modal = {
  MODAL_UPLOAD_DOCUMENT: 'MODAL_UPLOAD_DOCUMENT',
  MODAL_UPLOAD_DOCUMENT_EXISTING: 'MODAL_UPLOAD_DOCUMENT_EXISTING',
};
