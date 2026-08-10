import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_APPROVAL: TableHeader[] = [
  {
    key: 'requestId',
    label: 'Request ID',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'userId',
    label: 'User ID',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'originName',
    label: 'Nama Asal',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'originRole',
    label: 'Jabatan Asal',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'originDivision',
    label: 'Divisi Asal',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'destinationName',
    label: 'Nama Tujuan',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'destinationRole',
    label: 'Jabatan Tujuan',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'destinationDivision',
    label: 'Divisi Tujuan',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'requestBy',
    label: 'Request By',
    sx: {
      minWidth: '8vw',
    },
  },

];
