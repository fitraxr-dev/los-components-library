import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_MONITORING: Array<TableHeader> = [
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: { minWidth: '14vw' },
  },
  {
    key: 'rmName',
    label: 'Nama Staff',
    sx: { minWidth: '14vw' },
  },
  {
    key: 'staffDivisionLabel',
    label: 'Divisi',
    sx: { minWidth: '7.5vw' },
  },

];

export const TABLE_HEADER_REASSIGN: Array<TableHeader> = [
  {
    key: 'pic',
    label: 'PIC',
  },
  {
    key: 'reAssignTo',
    label: 'Re-assign to',
  },
];

export const MODAL = {
  REASSIGN_TO: 'REASSIGN_TO_MODAL',
};

export const ESDD = 'ESDD';
export const MONITORING_ESDD = 'MONITORING_ESDD';
