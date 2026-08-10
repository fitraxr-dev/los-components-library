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
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    type: 'date',
  },
  {
    key: 'documentDate',
    label: 'Waktu Dokumen',
    type: 'time-only',
  },
];
