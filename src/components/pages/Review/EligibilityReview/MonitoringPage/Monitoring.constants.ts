import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_MONITORING: Array<TableHeader> = [
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'staffDivisionLabel',
    label: 'Divisi',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'rmName',
    label: 'Nama Staff',
    sx: {
      minWidth: '10vw',
    },
  },

];

export const TABLE_HEADER_REASSIGN: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
  },
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

export const CREDIT_CHECKING_MODULE = 'CREDIT_CHECKING';
export const MONITORING_CREDIT_CHECKING = 'MONITORING_CREDIT_CHECKING';
export const CREDIT_CHECKING_RESULT = 'CREDIT_CHECKING_RESULT';
