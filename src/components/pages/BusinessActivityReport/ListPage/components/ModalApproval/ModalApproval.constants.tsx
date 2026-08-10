import React from 'react';

import { formatDate, toDateString, toHourMinuteSecond } from '@/helpers/date';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const HEADER_TABLE: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'bucketProcessId',
    label: 'Bar ID',
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: { minWidth: '10vw' },
  },
  {
    key: '',
    label: 'Employee Name',
    render: (row) => (
      <TextStyle variant="body4">
        {row.pic[0] ? row.pic[0].name : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '10vw' },
  },
  {
    key: '',
    label: 'Call Date',
    render: (row) => (
      <TextStyle variant="body4">
        {row.additionalData?.callDate ? toDateString(row.additionalData.callDate) : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '10vw' },
  },
  {
    key: 'modifiedAt',
    label: 'Created Date',
    render: (row) => React.createElement(TextStyle, { variant: 'body4' }, row.modifiedAt !== null ? formatDate(row.modifiedAt, 'DD MMM YYYY, HH:mm:ss') : formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss')),
    sx: { minWidth: '10vw' },
    type: 'date',
  },
  {
    key: 'statusLabel',
    label: 'Status',
    sx: { minWidth: '10vw' },
    type: 'status',
  },
];
