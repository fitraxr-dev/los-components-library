import type { TableHeader } from '@/components/shared/Table/Table.types';


export const HISTORY_TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'debtor',
    label: 'Debitur / Proyek',
  },
  {
    key: 'pic',
    label: 'Nama PIC RM',
  },
  {
    key: 'division',
    label: 'Division',
  },
  {
    key: 'ratingType',
    label: 'Rating Type',
  },
  {
    key: 'ratingAnalyst',
    label: 'Rating Analyst',
  },
  {
    key: 'memoNumber',
    label: 'Nomor Memo',
  },
  {
    key: 'memoDate',
    label: 'Tanggal Rating Memo',
  },
  {
    key: 'ratingPeriod',
    label: 'Rating Periode',
  },
  {
    key: 'ratingResult',
    label: 'Rating Result',
  },
];
