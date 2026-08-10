import * as React from 'react';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/DndTable/DndTable.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'directorateLabel',
    label: 'Direktorat',
  },
  {
    key: 'divisionLabel',
    label: 'Divisi',
  },
  {
    key: 'staffName',
    label: 'Nama',
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
  },
  {
    key: 'consentRoleLabel',
    label: 'Role',
  },
  {
    key: 'sku',
    label: 'SKU',
    render: (row) => React.createElement(TextStyle, { variant: 'body4' }, row.sku ? 'Ya' : 'Tidak'),
  },
];
