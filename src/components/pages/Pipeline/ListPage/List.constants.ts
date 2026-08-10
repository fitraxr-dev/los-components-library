import type { TableHeader as TableHeaderType } from '@/components/shared/Table/Table.types';


export const modal = {
  CUSTOMER_DK_VALIDATION: 'CUSTOMER_DK_VALIDATION',
  DEBTOR: 'DEBTOR',

};

export const tableHeaderConstants: TableHeaderType[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'bucketMaster',
    label: 'Master ID',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'bucketProcessId',
    label: 'Pipeline ID',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'institutionTypeLabel',
    label: 'Institution type',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'modifiedAt',
    label: 'Create Date',
    sx: {
      minWidth: '9vw',
    },
    type: 'date',
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    sx: {
      minWidth: '9vw',
    },
    type: 'date',
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'statusLabel',
    label: 'Status',
    sx: {
      minWidth: '9vw',
    },
    type: 'status',
  },
];
