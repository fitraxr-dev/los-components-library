import React from 'react';

import { formatDate, toDateString } from '@/helpers/date';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const MODAL = {
  ASSIGN_TO: 'ASSIGN_TO_MODAL',
};

export const TABLE_HEADER: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      width: '5%',
    },
    type: 'index',
  },
  {
    key: 'bucketMaster',
    label: 'Master ID',
    sx: {
      minWidth: '7.5vw',
    },
  },
  {
    key: 'bucketProcessId',
    label: 'ID',
    sx: {
      width: '15%',
    },
  },
  {
    key: 'institutionTypeLabel',
    label: 'Tipe Institusi',
    sx: { minWidth: '6vw' },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      width: '15%',
    },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: {
      width: '10%',
    },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: {
      minWidth: '12vw',
    },
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
    render: (row) => (
      <TextStyle variant="body4">{row.createdAt ? toDateString(row.createdAt) : '-'}</TextStyle>
    ),
    sx: { minWidth: '10vw' },
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: {
      width: '15%',
    },
  },
];
