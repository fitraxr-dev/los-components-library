import React from 'react';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


// Table Headers
export const BUSINESS_SUMMARY_HEADER: TableHeader[] = [
  { key: 'index', label: 'No', type: 'index' },
  { key: 'kodeBusinessSummary', label: 'Kategori Business Summary' },
  { key: 'label', label: 'Label' },
  { key: 'active', label: 'Active' },
  { key: 'modifiedBy', label: 'Modified By' },
  { key: 'lastModified', label: 'Last Modified' }
];

export const createUpdateBusinessSummaryHeader = (theme: any): TableHeader[] => [
  { key: 'index', label: 'No', type: 'index' },
  {
    key: 'status',
    label: 'Status',
    render: (row: any) => {
      return React.createElement(TextStyle, {
        color: theme.palette.primary.main,
        variant: 'body4',
        weight: 600,
      }, row.status);
    },
  },
  { key: 'code', label: 'Kategori Business Summary' },
  { key: 'label', label: 'Kategori' },
  {
    key: 'isActive',
    label: 'Active',
    render: (row: any) => {
      return React.createElement(TextStyle, {
        variant: 'body4',
      }, row.isActive ? 'Ya' : 'Tidak');
    },
  },
  { key: 'modifiedBy', label: 'Modified By' },
  { key: 'modifiedDate', label: 'Last Modified', type: 'date' }
];

export const ADD_NEW_BUSINESS_SUMMARY_HEADER: TableHeader[] = [
  { key: 'index', label: 'No', type: 'index' },
  { key: 'code', label: 'Kategori Business Summary', sx: { minWidth: '15vw' } },
  { key: 'label', label: 'Kategori', sx: { minWidth: '10vw' } },
  {
    key: 'isActive',
    label: 'Active',
    render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
    sx: { minWidth: '7vw' },
  },
  { key: 'modifiedBy', label: 'Created By', sx: { minWidth: '7vw' } },
  { key: 'modifiedDate', label: 'Created Date', sx: { minWidth: '7vw' }, type: 'date' }
];
