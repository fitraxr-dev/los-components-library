import TextStyle from '@/components/shared/TextStyle';

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
    key: 'currency',
    label: 'Currency',
    sx: {
      minWidth: '10vw',
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
    key: 'ariumCode',
    label: 'Kode Arium',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'temenosCode',
    label: 'Kode Temenos',
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
