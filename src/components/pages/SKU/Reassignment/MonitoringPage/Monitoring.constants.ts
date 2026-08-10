import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_MONITORING: Array<TableHeader> = [
  {
    key: 'requestId',
    label: 'Request ID',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'userId',
    label: 'User ID',
    sx: { minWidth: '5vw' },
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
    key: 'reason',
    label: 'Reason',
    sx: { minWidth: '12.5vw' },
  },
  {
    key: 'duration',
    label: 'Durasi',
    sx: { minWidth: '20vw' },
  },
];
