import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_COT_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <TextStyle weight={600} color="primary.main">
        {row.status}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'processCode',
    label: 'Process',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'cutOfTime',
    label: 'Cut of Time',
    render: (row) => (
      <TextStyle>
        {row.cutOfTime === null ? '-' : row.cutOfTime}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'isActive',
    label: 'Active',
    render: (row) => (
      <TextStyle>
        {row.isActive ? 'Ya' : 'Tidak'}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
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
];

export const TABLE_EOD_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <TextStyle weight={600} color="primary.main">
        {row.status}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'processCode',
    label: 'Process',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'endOfDay',
    label: 'End of Day',
    render: (row) => (
      <TextStyle>
        {row.endOfDay === null ? '-' : row.endOfDay}
      </TextStyle>
    ),
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
    key: 'isActive',
    label: 'Active',
    render: (row) => (
      <TextStyle>
        {row.isActive ? 'Ya' : 'Tidak'}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
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
];
