import * as React from 'react';

import Icon from '@/components/shared/Icon';

import type { TableHeader } from '@/components/shared/DndTable/DndTable.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: '',
    label: '',
    render: () => React.createElement(
      Icon,
      {
        iconName: 'drag-and-drop',
        sx: { '&:active': { cursor: 'grabbing' }, cursor: 'grab', marginRight: 1, path: { stroke: 'common.white' } },
        textVariant: 'body4',
      }
    ),
    sx: { width: '3vw' },
  },
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
];
