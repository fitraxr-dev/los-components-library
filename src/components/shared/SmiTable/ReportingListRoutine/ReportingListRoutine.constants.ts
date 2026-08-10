import type { TableHeader } from '@/components/shared/Table/Table.types';


export const MODAL_ID = {
  CREATE_SUB_REPORT: 'CREATE_SUB_REPORT',
  EDIT_LIST_REPORT: 'EDIT_LIST_REPORT',
};


export const TABLE_HEADER: Array<TableHeader> = [
  {
    key: 'report',
    label: 'Laporan',
    sx: { width: '25%' },
  },
  {
    key: 'isQuarterly',
    label: 'Triwulan',
    sx: { width: '10%' },
  },
  {
    key: 'isSemester',
    label: 'Semester',
    sx: { width: '10%' },
  },
  {
    key: 'isAnnual',
    label: 'Tahunan',
    sx: { width: '10%' },
  },
];
