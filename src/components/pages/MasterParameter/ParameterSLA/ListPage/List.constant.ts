import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'moduleLabel',
    label: 'Process',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'slaBusiness',
    label: 'SLA Bisnis',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'slaNonBusiness',
    label: 'SLA Non Bisnis',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'slaSummary',
    label: 'SLA Summary',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'modifiedDate',
    label: 'Last Modified',
    sx: {
      minWidth: '10vw',
    },
    type: 'date',
  },
];

export const MODAL = {
  APPROVAL_STATUS_MODAL: 'APPROVAL_STATUS_MODAL',
};
