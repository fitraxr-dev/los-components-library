import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  MODAL_UPLOAD_DOCUMENT_RISALAH: 'MODAL_UPLOAD_DOCUMENT_RISALAH',
};

export const TABLE_HEADER: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
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
  {
    key: 'time',
    label: 'Jam',
  },
];
