import * as React from 'react';

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
    sx: { maxWidth: '10vw' },
    type: 'index',
  },
  {
    key: 'bucketProcessId',
    label: 'ID Process',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'code',
    label: 'Kode',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'noItemGroup',
    label: 'Nomor\nItem\nGroup',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'itemGroup',
    label: 'Item Group',
    render: (row) => React.createElement(TextStyle, { sx: { wordBreak: 'break-all' } }, truncateText(stripHtmlTags(row?.itemGroup ?? '-'), 35)),
    sx: { maxWidth: '10vw', minWidth: '10vw' },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'modifiedDate',
    label: 'Last Modified',
    sx: { maxWidth: '10vw' },
    type: 'date',
  },
  {
    key: 'statusLabel',
    label: 'Status',
    sx: { maxWidth: '10vw' },
    type: 'status',
  },
];

export const MODAL = {
  APPROVAL_STATUS_MODAL: 'APPROVAL_STATUS_MODAL',
};
