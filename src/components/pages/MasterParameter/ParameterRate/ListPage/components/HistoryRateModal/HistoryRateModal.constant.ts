import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '3vw',
    },
    type: 'index',
  },
  {
    key: 'bucketProcessId',
    label: 'ID Process',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'currency',
    label: 'Currency',
    sx: {
      minWidth: '7vw',
    },
  },
  {
    key: 'exchangeRate',
    label: 'Exchange Rate',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'modifiedDate',
    label: 'Last Modified',
    sx: {
      minWidth: '12vw',
    },
    type: 'date',
  },
  {
    key: 'statusLabel',
    label: 'Status',
    sx: {
      minWidth: '10vw',
    },
    type: 'status',
  },
];
