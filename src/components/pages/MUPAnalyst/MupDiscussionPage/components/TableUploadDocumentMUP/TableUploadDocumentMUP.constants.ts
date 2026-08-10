import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  UPLOAD_DOCUMENT_MUP: 'UPLOAD_DOCUMENT_MUP',
};

export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'documentName',
    label: 'Nama Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    sx: {
      minWidth: '10vw',
    },
    type: 'date',
  },
  {
    key: 'time',
    label: 'Jam',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'analystConfirm',
    label: 'Confirm Analyst',
    sx: {
      minWidth: '10vw',
    },
  },
];
