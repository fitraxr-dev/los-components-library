import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'noPKAddendum',
    label: 'No. PK/No. Addendum',
  },
  {
    key: 'tipePerjanjian',
    label: 'Tipe Perjanjian (PK/Addendum)',
  },
  {
    key: 'tanggalPKAddendum',
    label: 'Tanggal PK/Addendum',
  },
  {
    key: 'tanggalEfektif',
    label: 'Tanggal Efektif',
  },
  {
    key: 'deskripsi',
    label: 'Deskripsi',
  },
];
