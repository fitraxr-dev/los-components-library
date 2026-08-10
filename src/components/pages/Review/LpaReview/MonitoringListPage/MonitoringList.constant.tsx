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
    key: 'bucketMaster',
    label: 'Master ID',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'id',
    label: 'ID',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'institutionTypeLabel',
    label: 'Tipe Institusi',
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
    key: 'rmName',
    label: 'Nama Staff',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'pic',
    label: 'PIC',
    render: (row) => {
      if (!row.pic || !Array.isArray(row.pic) || row.pic.length === 0) {
        return <TextStyle variant="body4">-</TextStyle>;
      }
      const allPicNames = row.pic.map((pic) => pic.name).join(', ');
      return (
        <TextStyle
          variant="body4"
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          {allPicNames}
        </TextStyle>
      );
    },
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
    sx: { minWidth: '10vw' },
    type: 'date',
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'status',
    label: 'Status',
    sx: { minWidth: '12vw' },
    type: 'status',
  },
];
