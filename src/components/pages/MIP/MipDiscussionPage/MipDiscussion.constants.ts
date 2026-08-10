import type { TableHeader } from '@/components/shared/Table/Table.types';


export enum PemdaEnum {
  CENTRAL_GOVERNMENT = 'CENTRAL_GOVERNMENT',
  PROVINCE_GOVERNMENT = 'PROVINCE_GOVERNMENT',
  MUNICIPAL_GOVERNMENT = 'MUNICIPAL_GOVERNMENT',
  REGENCY_GOVERNMENT = 'REGENCY_GOVERNMENT'
}

export const tableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'documentGroupLabel',
    label: 'Group Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'documentTypeLabel',
    label: 'Jenis Dokumen',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'fileName',
    label: 'Nama Dokumen',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    sx: { minWidth: '10vw' },
    type: 'date',
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
