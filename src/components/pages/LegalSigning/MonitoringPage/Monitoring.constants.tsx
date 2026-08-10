import React from 'react';

import { toDateString } from '@/helpers/date';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_MONITORING: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
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
      minWidth: '8vw',
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
      minWidth: '12.5vw',
    },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: {
      minWidth: '10vw',
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
    render: (row) => (
      <ColumnWrapper>
        {row?.pic?.map((item, idx: number) => {
          return (
            <TextStyle key={idx} weight={item.isLeader ? 600 : 400}>
              {item.name}
            </TextStyle>
          );
        })}
      </ColumnWrapper>
    ),
    sx: {
      minWidth: '7vw',
    },
  },
  {
    key: 'createdAt',
    label: 'Created Date',
    render: (row) => (
      <TextStyle variant="body4">{row.createdAt ? toDateString(row.createdAt) : '-'}</TextStyle>
    ),
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    render: (row) => (
      <TextStyle variant="body4">{row.dueDate ? toDateString(row.dueDate) : '-'}</TextStyle>
    ),
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: {
      minWidth: '8vw',
    },
  },
];

export const TABLE_HEADER_REASSIGN: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
  },
  {
    key: 'pic',
    label: 'PIC',
  },
  {
    key: 'reAssignTo',
    label: 'Re-assign to',
  },
];

export const MODAL = {
  REASSIGN_TO: 'REASSIGN_TO_MODAL',
};

export const ESDD = 'ESDD';
export const MONITORING_ESDD = 'MONITORING_ESDD';
