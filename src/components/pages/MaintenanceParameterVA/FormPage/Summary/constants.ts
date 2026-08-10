import React from 'react';

import { formatDate } from '@/helpers/date/dateFormat';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';

// Table 1 - Business Summary Data
export const BUSINESS_SUMMARY_DATA = [
  {
    active: 'Ya',
    id: 1,
    kodeBusinessSummary: '394285',
    label: 'Permintaan data, informasi, dan dokumen',
    lastModified: '12 Jun 2025 14:30:49',
    modifiedBy: 'Reni',
  },
  {
    active: 'Ya',
    id: 2,
    kodeBusinessSummary: '394286',
    label: 'Maintain relationship',
    lastModified: '13 Jun 2025 14:30:49',
    modifiedBy: 'Reni',
  },
  {
    active: 'Tidak',
    id: 3,
    kodeBusinessSummary: '394287',
    label: 'Analisis kredit',
    lastModified: '14 Jun 2025 10:15:30',
    modifiedBy: 'Budi',
  },
  {
    active: 'Ya',
    id: 4,
    kodeBusinessSummary: '394288',
    label: 'Monitoring dan evaluasi',
    lastModified: '15 Jun 2025 16:45:20',
    modifiedBy: 'Sari',
  }
];

// Table 2 - Update Business Summary (with rowSpan)
export const UPDATE_BUSINESS_SUMMARY_DATA = [
  {
    active: 'Ya',
    id: 1,
    index: { rowSpan: 2, value: 1 },
    kodeBusinessSummary: '394285',
    label: 'Permintaan data, informasi, dan dokumen',
    lastModified: '12 Jun 2025 14:30:49',
    modifiedBy: 'Reni',
    status: 'Previous',
  },
  {
    active: 'Ya',
    id: 1,
    index: { rowSpan: 0, value: '' },
    kodeBusinessSummary: '394285',
    label: 'Permintaan data, informasi, dan dokumen (Updated)',
    lastModified: '13 Jun 2025 14:30:49',
    modifiedBy: 'Reni',
    status: 'Last Modified',
  },
  {
    active: 'Ya',
    id: 2,
    index: { rowSpan: 2, value: 2 },
    kodeBusinessSummary: '394286',
    label: 'Maintain relationship',
    lastModified: '13 Jun 2025 14:30:49',
    modifiedBy: 'Reni',
    status: 'Previous',
  },
  {
    active: 'Ya',
    id: 2,
    index: { rowSpan: 0, value: '' },
    kodeBusinessSummary: '394286',
    label: 'Maintain relationship (Enhanced)',
    lastModified: '14 Jun 2025 09:20:15',
    modifiedBy: 'Reni',
    status: 'Last Modified',
  },
  {
    active: 'Tidak',
    id: 3,
    index: { rowSpan: 2, value: 3 },
    kodeBusinessSummary: '394287',
    label: 'Analisis kredit',
    lastModified: '14 Jun 2025 10:15:30',
    modifiedBy: 'Budi',
    status: 'Previous',
  },
  {
    active: 'Ya',
    id: 3,
    index: { rowSpan: 0, value: '' },
    kodeBusinessSummary: '394287',
    label: 'Analisis kredit (Revised)',
    lastModified: '15 Jun 2025 11:30:45',
    modifiedBy: 'Budi',
    status: 'Last Modified',
  }
];

// Table 3 - Add New Business Summary
export const ADD_NEW_BUSINESS_SUMMARY_DATA = [
  {
    active: 'Ya',
    id: 5,
    kodeBusinessSummary: '394289',
    label: 'Risk assessment',
    lastModified: '16 Jun 2025 08:00:00',
    modifiedBy: 'Admin',
  },
  {
    active: 'Ya',
    id: 6,
    kodeBusinessSummary: '394290',
    label: 'Customer onboarding',
    lastModified: '16 Jun 2025 08:00:00',
    modifiedBy: 'Admin',
  },
  {
    active: 'Ya',
    id: 7,
    kodeBusinessSummary: '394291',
    label: 'Document verification',
    lastModified: '16 Jun 2025 08:00:00',
    modifiedBy: 'Admin',
  },
  {
    active: 'Ya',
    id: 8,
    kodeBusinessSummary: '394292',
    label: 'Approval workflow',
    lastModified: '16 Jun 2025 08:00:00',
    modifiedBy: 'Admin',
  },
  {
    active: 'Ya',
    id: 9,
    kodeBusinessSummary: '394293',
    label: 'Compliance check',
    lastModified: '16 Jun 2025 08:00:00',
    modifiedBy: 'Admin',
  }
];

// Table Headers
export const BUSINESS_SUMMARY_HEADER: TableHeader[] = [
  { key: 'index', label: 'No', type: 'index' },
  { key: 'kodeBusinessSummary', label: 'Kategori Business Summary' },
  { key: 'label', label: 'Label' },
  { key: 'active', label: 'Active' },
  { key: 'modifiedBy', label: 'Modified By' },
  { key: 'lastModified', label: 'Last Modified' }
];

export const createUpdateBusinessSummaryHeader = (theme: any, onDetailClick?: (data: any) => void): TableHeader[] => [
  { key: 'index', label: 'No', sx: { minWidth: '3vw' }, type: 'index' },
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
    sx: { minWidth: '10vw' },
  },
  { key: 'bankName', label: 'Bank', sx: { minWidth: '7vw' } },
  { key: 'vaType', label: 'VA Type', sx: { minWidth: '10vw' } },
  { key: 'customerType', label: 'Customer Type', sx: { minWidth: '15vw' } },
  { key: 'currency', label: 'Currency', sx: { minWidth: '7vw' } },
  {
    key: 'isActive',
    label: 'Active',
    render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive === '-' ? '-' : (row.isActive ? 'Ya' : 'Tidak')),
    sx: { minWidth: '7vw' },
  },
  { key: 'createdBy', label: 'Created By', sx: { minWidth: '10vw' } },
  {
    key: 'createdDate',
    label: 'Created Date',
    render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.createdDate === '-' ? '-' : formatDate(row.createdDate, 'DD MMM YYYY, HH:mm:ss')),
    sx: { minWidth: '13vw' },
    type: 'date',
  },
  {
    key: 'action',
    label: 'Action',
    options: onDetailClick ? [
      {
        iconName: 'detail',
        onClick: onDetailClick,
      }
    ] : [],
    type: 'action',
  },
];

export const createAddNewBusinessSummaryHeader = (onDetailClick: (data: any) => void): TableHeader[] => [
  { key: 'index', label: 'No', sx: { minWidth: '3vw' }, type: 'index' },
  { key: 'bankName', label: 'Bank', sx: { minWidth: '15vw' } },
  { key: 'vaType', label: 'VA Type', sx: { minWidth: '10vw' } },
  { key: 'customerType', label: 'Customer Type', sx: { minWidth: '15vw' } },
  { key: 'currency', label: 'Currency', sx: { minWidth: '7vw' } },
  {
    key: 'isActive',
    label: 'Active',
    render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
    sx: { minWidth: '7vw' },
  },
  { key: 'createdBy', label: 'Created By', sx: { minWidth: '10vw' } },
  { key: 'createdDate', label: 'Created Date', sx: { minWidth: '13vw' }, type: 'date' },
  {
    key: 'action',
    label: 'Action',
    options: onDetailClick ? [
      {
        iconName: 'detail',
        onClick: onDetailClick,
      }
    ] : [],
    type: 'action',
  },
];

export const ADD_NEW_BUSINESS_SUMMARY_HEADER: TableHeader[] = [
  { key: 'index', label: 'No', sx: { minWidth: '3vw' }, type: 'index' },
  { key: 'bankName', label: 'Bank', sx: { minWidth: '7vw' } },
  { key: 'vaType', label: 'VA Type', sx: { minWidth: '10vw' } },
  { key: 'customerType', label: 'Customer Type', sx: { minWidth: '15vw' } },
  { key: 'currency', label: 'Currency' },
  {
    key: 'isActive',
    label: 'Active',
    render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
  },
  { key: 'createdBy', label: 'Created By' },
  { key: 'createdDate', label: 'Created Date', type: 'date' },
];
