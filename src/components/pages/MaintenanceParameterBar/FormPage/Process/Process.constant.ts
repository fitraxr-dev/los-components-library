import React from 'react';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';

// Types
interface TableItem {
  id: number;
  kode: string;
  label: string;
  status: string;
  isActive: boolean;
  applicationType?: string;
  code?: string;
  noItemGroup?: number;
  itemGroup?: string;
}

// Table header with action buttons
export const tableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '3vw' },
    type: 'index',
  },
  {
    key: 'applicationType',
    label: 'Jenis Permohonan',
    sx: { minWidth: '7vw' },
  },
  {
    key: 'code',
    label: 'Kode',
    sx: { minWidth: '15vw' },
  },
  {
    key: 'noItemGroup',
    label: 'Nomor Item Group',
    sx: { minWidth: '15vw' },
  },
  {
    key: 'itemGroup',
    label: 'Item Group',
    render: (data, index) => {
      const value = data?.itemGroup;
      if (typeof value === 'string' && value.includes('<')) {
        const cleanValue = value.replace(/<[^>]*>/g, '');
        return cleanValue.length > 100 ? cleanValue.substring(0, 100) + '...' : cleanValue;
      }
      return typeof value === 'string' ? value : String(value || '-');
    },
    sx: {
      fontSize: '12px',
      fontWeight: 'normal',
      minWidth: '15vw',
    },
  },
  {
    key: 'isActive',
    label: 'Active',
    render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
    sx: { minWidth: '1vw' },
  },
  {
    key: 'createdBy',
    label: 'Created By',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    sx: { minWidth: '13vw' },
    type: 'date',
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'modifiedDate',
    label: 'Last Modified',
    sx: { minWidth: '13vw' },
    type: 'date',
  },
  {
    key: 'action',
    label: 'Action',
    options: [
      {
        iconName: 'detail',
        onClick: (data: TableItem) => {
          // This will be handled by the hook
        },
      },
      {
        iconName: 'edit',
        onClick: (data: TableItem) => {
          // This will be handled by the hook
        },
      },
    ],
    type: 'action',
  },
];

export type { TableItem };
