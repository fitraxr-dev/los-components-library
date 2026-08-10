import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [

  {
    key: 'documentGroupLabel',
    label: 'Group  Dokumen',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'documentTypeLabel',
    label: 'Jenis Dokumen',
    sx: { minWidth: '16vw' },
  },
  {
    key: 'fileName',
    label: 'Nama Dokumen',
    sx: { minWidth: '20vw' },
  },

  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: { minWidth: '15vw' },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    sx: { minWidth: '12vw' },
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
  }
];

export const TABLE_HEADER_HOSTORY_BAST: TableHeader[] = [
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

export const GENERATE = 'GENERATE';


export const modal = {
  MODAL_HISTORY_BAST: 'MODAL_HISTORY_BAST',
};
