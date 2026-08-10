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
    key: 'nomorItem',
    label: 'Nomor Item',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'item',
    label: 'Item',
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
    key: 'createdBy',
    label: 'Created By',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    sx: {
      minWidth: '10vw',
    },
    type: 'date',
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
