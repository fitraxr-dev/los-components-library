import type { TableHeader } from '@/components/shared/Table/Table.types';


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
    key: 'documentCategory',
    label: 'Kategori Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentGroup',
    label: 'Group Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentType',
    label: 'Jenis Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentName',
    label: 'Nama Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentFile',
    label: 'Upload Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
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
  },
];
