import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_CREDIT_CHECKING: Array<TableHeader> = [
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
      minWidth: '15vw',
    },
  },
  {
    key: 'documentType',
    label: 'Jenis Dokumen',
    sx: {
      minWidth: '15vw',
    },
  },
  {
    key: 'documentName',
    label: 'Nama Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'documentUpload',
    label: 'Upload Dokumen',
    sx: {
      minWidth: '15vw',
    },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
];

export const DROPDOWN_JABATAN = [
  {
    label: 'Direktur Keuangan',
    value: 'DIRUT',
  },
  {
    label: 'Office Boy',
    value: 'OB',
  },
];
