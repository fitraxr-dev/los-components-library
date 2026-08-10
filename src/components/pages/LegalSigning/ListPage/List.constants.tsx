import React from 'react';

import { formatDate, toDateString } from '@/helpers/date';

import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


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
      minWidth: '7.5vw',
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
      minWidth: '14vw',
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
    key: 'pic',
    label: 'PIC',
    render: (row) => <PICRenderer data={row?.pic} />,
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
    key: 'dueDate',
    label: 'Due Date',
    render: (row) => (
      <TextStyle variant="body4">{row.dueDate ? toDateString(row.dueDate) : '-'}</TextStyle>
    ),
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: {
      minWidth: '7.5vw',
    },
  },
];
