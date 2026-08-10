import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_GROUP: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'product',
    label: 'Nama Produk',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'productReference',
    label: 'Referensi',
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
];
