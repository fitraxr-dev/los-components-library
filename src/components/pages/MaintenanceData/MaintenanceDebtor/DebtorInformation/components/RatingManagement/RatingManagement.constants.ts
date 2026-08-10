import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '6vw' },
    type: 'index',
  },
  {
    key: 'picName',
    label: 'Nama PIC RM',
  },
  {
    key: 'division',
    label: 'Divisi',
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
    key: 'ratingMemoDate',
    label: 'Tanggal Rating Memo',
  },
  {
    key: 'ratingPeriod',
    label: 'Rating Period',
  },
  {
    key: 'ratingResult',
    label: 'Rating Result',
  },
  {
    key: 'grade',
    label: 'Grade',
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
  },
];
