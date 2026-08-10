import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_MONITORING: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'bucketMaster',
    label: 'Master ID',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'id',
    label: 'ID',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'institutionTypeLabel',
    label: 'Tipe Institusi',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'staffDivisionLabel',
    label: 'Divisi',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'staffName',
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

export const ESDD = 'ESDD';
export const MONITORING_ESDD = 'MONITORING_ESDD';
