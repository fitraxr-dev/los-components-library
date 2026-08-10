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
    key: 'cutOfTime',
    label: 'Cut of Time',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'endOfDay',
    label: 'End of Day',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'eodDate',
    label: 'Tanggal EOD',
    sx: {
      minWidth: '10vw',
    },
    type: 'date-only',
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: {
      minWidth: '13vw',
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
      minWidth: '15vw',
    },
    type: 'status',
  },
];
