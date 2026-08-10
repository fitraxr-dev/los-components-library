import * as React from 'react';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'directorateLabel',
    label: 'Direktorat',
    sx: { minWidth: '6vw' },
  },
  {
    key: 'divisionLabel',
    label: 'Divisi',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'name',
    label: 'Nama',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'positionLabel',
    label: 'Jabatan',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'isPresent',
    label: 'Kehadiran',
    render: (data) => React.createElement(TextStyle, { variant: 'body4' }, data.isPresent === true ? 'Ya' : 'Tidak'),
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'sku',
    label: 'SKU',
    render: (data) => React.createElement(TextStyle, { variant: 'body4' }, data.sku === true ? 'Ya' : 'Tidak'),
    sx: { minWidth: '7.5vw' },
  },
];
