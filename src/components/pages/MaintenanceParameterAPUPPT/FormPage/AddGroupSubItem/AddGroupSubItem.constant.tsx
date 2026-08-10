import React from 'react';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const truncateText = (value, maxLength = 100) => {
  // eslint-disable-next-line eqeqeq
  const str = value == null ? '' : String(value);
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, '');
};

export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { width: '10vw' },
    type: 'index',
  },
  {
    key: 'nomorSubItem',
    label: 'Nomor\nSub Item',
    sx: { width: '10vw' },
  },
  {
    key: 'subItem',
    label: 'Sub Item',
    render: (row) => React.createElement(TextStyle, null, truncateText(stripHtmlTags(row?.subItem ?? '-'), 35)),

    sx: { width: '10vw' },
  },
  {
    key: 'isActive',
    label: 'Active',
    render: (row) => (
      <TextStyle>
        {row.isActive ? 'Ya' : 'Tidak'}
      </TextStyle>
    ),
    sx: { width: '10vw' },
  },
  {
    key: 'needConfirmation',
    label: 'Can Edit',
    render: (row) => (
      <TextStyle>
        {row.needConfirmation ? 'Ya' : 'Tidak'}
      </TextStyle>
    ),
    sx: { width: '10vw' },
  },
  {
    key: 'additionalAction',
    label: 'To Maintenance Customer',
    render: (row) => (
      <TextStyle>
        {row.additionalAction ? 'Ya' : 'Tidak'}
      </TextStyle>
    ),
    sx: { width: '10vw' },
  },
  {
    key: 'createdBy',
    label: 'Created By',
    sx: { width: '10vw' },
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    sx: { width: '10vw' },
    type: 'date',
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: { width: '10vw' },
  },
  {
    key: 'modifiedDate',
    label: 'Last Modified',
    sx: { width: '10vw' },
    type: 'date',
  },
];

export const NOMOR_ITEM_GROUP_OPTIONS = [
  { label: 'Item 001', value: '001' },
  { label: 'Item 002', value: '002' },
  { label: 'Item 003', value: '003' },
  { label: 'Item 004', value: '004' },
  { label: 'Item 005', value: '005' },
  { label: 'Item 006', value: '006' },
  { label: 'Item 007', value: '007' },
  { label: 'Item 008', value: '008' },
  { label: 'Item 009', value: '009' },
  { label: 'Item 010', value: '010' },
];

// Hardcoded options for Nomor Item dropdown
