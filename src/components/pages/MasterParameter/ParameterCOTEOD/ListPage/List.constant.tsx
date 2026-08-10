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
    key: 'process',
    label: 'Process',
    sx: {
      minWidth: '10vw',
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
    key: 'isActive',
    label: 'Active',
    render: (row) => (
      <TextStyle>
        {row.isActive ? 'Ya' : 'Tidak'}
      </TextStyle>
    ),
    sx: {
      minWidth: '7.5vw',
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
    key: 'process',
    label: 'Process',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'endOfDay',
    label: 'End of Day',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'eodDate',
    label: 'Tanggal EOD',
    sx: {
      minWidth: '8vw',
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
      minWidth: '7.5vw',
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

export const MODAL = {
  APPROVAL_STATUS_MODAL: 'APPROVAL_STATUS_MODAL',
};
