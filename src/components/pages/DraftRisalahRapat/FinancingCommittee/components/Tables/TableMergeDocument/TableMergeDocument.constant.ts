import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'fileName',
    label: 'Nama Dokumen',
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
  },
  {
    key: 'createdAt',
    label: 'Tanggal Dokumen',
    type: 'date-only',
  },
  {
    key: 'createdAt',
    label: 'Waktu Dokumen',
    type: 'time-only',
  }
];
