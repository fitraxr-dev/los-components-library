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
    key: 'bucketProcessId',
    label: 'ID Process',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'processLabel',
    label: 'Process',
    sx: {
      minWidth: '13vw',
    },
  },
  {
    key: 'groupDivision',
    label: 'Group Division',
    sx: {
      minWidth: '13vw',
    },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
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
  {
    key: 'statusLabel',
    label: 'Status',
    sx: {
      minWidth: '10vw',
    },
    type: 'status',
  },
];
