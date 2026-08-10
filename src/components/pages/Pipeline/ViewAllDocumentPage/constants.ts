import type { TableHeader } from '@/components/shared/Table/Table.types';


export const DIGITAL_MEMO = 'DIGITAL_MEMO';
export const FINANCING_DOCUMENT = 'FINANCING_DOCUMENT';
export const SUPPORTING_DOCUMENTS = 'SUPPORTING_DOCUMENTS';
export const CREDIT_CHECKING = 'CREDIT_CHECKING';

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
