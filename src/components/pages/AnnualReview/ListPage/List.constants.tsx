import React from 'react';

import { formatDate, toDateString } from '@/helpers/date';

import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '3vw',
    },
    type: 'index',
  },
  {
    key: 'bucketMaster',
    label: 'Master ID',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'bucketProcessId',
    label: 'ID',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'institutionType',
    label: 'Tipe Institusi',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'customerName',
    label: 'Nama Customer',
    sx: {
      minWidth: '12vw',
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
  // {
  //   key: 'pic',
  //   label: 'PIC',
  //   render: (row) => <PICRenderer data={row?.pic} />,
  //   sx: { minWidth: '10vw' },
  // },
  {
    key: 'modifiedAt',
    label: 'Created Date',
    render: (row) => React.createElement(TextStyle, { variant: 'body4' }, row.modifiedAt !== null ? formatDate(row.modifiedAt, 'DD MMM YYYY, HH:mm:ss') : formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss')),
    sx: { minWidth: '12vw' },
    type: 'date',
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    // render: (row) => (
    //   <TextStyle variant="body4">{row.dueDate ? toDateString(row.dueDate) : '-'}</TextStyle>
    // ),
    sx: {
      minWidth: '12vw',
    },
    type: 'date',
  },
  {
    key: 'aging',
    label: 'Aging',
    render: (row) => (
      <TextStyle variant="body4">{row.aging ?? '-'}</TextStyle>
    ),
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'statusLabel',
    label: 'Status',
    type: 'status',
  },
];

export const TABLE_HEADER_DEPI: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '3vw',
    },
    type: 'index',
  },
  {
    key: 'bucketMaster',
    label: 'Master ID',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'bucketProcessId',
    label: 'ID',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'institutionType',
    label: 'Tipe Institusi',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'customerName',
    label: 'Nama Customer',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'staffDivisionLabel',
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
    render: (row) => <PICRenderer data={row?.pic} />,
    sx: { minWidth: '10vw' },
  },
  {
    key: 'modifiedAt',
    label: 'Created Date',
    render: (row) => React.createElement(TextStyle, { variant: 'body4' }, row.modifiedAt !== null ? formatDate(row.modifiedAt, 'DD MMM YYYY, HH:mm:ss') : formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss')),
    sx: { minWidth: '12vw' },
    type: 'date',
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    // render: (row) => (
    //   <TextStyle variant="body4">{row.dueDate ? toDateString(row.dueDate) : '-'}</TextStyle>
    // ),
    sx: {
      minWidth: '12vw',
    },
    type: 'date',
  },
  {
    key: 'aging',
    label: 'Aging',
    render: (row) => (
      <TextStyle variant="body4">{row.aging ?? '-'}</TextStyle>
    ),
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'statusLabel',
    label: 'Status',
    type: 'status',
  },
];

export const modalAnnualReview = {
  ADD_NEW: 'ADD_NEW',
  MODAL_TABLE_DK: 'MODAL_TABLE_DK',
};

export const mockData = [
  {
    aging: 'Gatau',
    bucketMaster: 'Master-001',
    bucketProcessId: 'PRC-001',
    createdDate: '2025-10-07T09:49:49.385+07:00',
    customerName: 'Rahmat',
    division: 'Gatau',
    dueDate: '2025-10-07T09:49:49.385+07:00',
    institutionType: 'Energy',
    noPk: 'PK-001',
    pkDate: '2025-10-07T09:49:49.385+07:00',
    pkName: 'Gakenal',
    staffName: 'Nugi',
    statusLabel: 'Gatau',
  }
];

export const mockSearchBy = [
  {
    label: 'Nama Customer',
    value: 'd.name',
  },
  {
    label: 'ID',
    value: 'b.bucket_process_id',
  },
  {
    label: 'Tipe Institusi',
    value: 'lblType.value1',
  },
  {
    label: 'Divisi',
    value: 'd.division',
  },
  {
    label: 'Nama Staff',
    value: 'u.full_name',
  },
  {
    label: 'Nama PK',
    value: 'u.pk_name',
  },
  {
    label: 'No. PK/Adendum',
    value: 'u.pk',
  },
];
