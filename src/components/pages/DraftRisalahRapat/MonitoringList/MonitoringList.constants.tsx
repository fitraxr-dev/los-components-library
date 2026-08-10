import React from 'react';

import { formatDate } from '@/helpers/date';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderResultList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'bucketProcessId',
    label: 'ID',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'staffName',
    label: 'Nama RM',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'modifiedAt',
    label: 'Created Date',
    render: (row) => React.createElement(TextStyle, { variant: 'body4' }, row.modifiedAt !== null ? formatDate(row.modifiedAt, 'DD MMM YYYY, HH:mm:ss') : formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss')),
    sx: { minWidth: '10vw' },
    type: 'date',
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    sx: { minWidth: '10vw' },
    type: 'date',
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: { minWidth: '10vw' },
    type: 'date',
  },
];
