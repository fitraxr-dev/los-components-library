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

export const SUMMARY_MODAL_IDS = {
  SUMMARY_DETAIL_MODAL: 'SUMMARY_DETAIL_MODAL',
};

export const INDEX_COL: TableHeader = {
  key: 'index',
  label: 'No',
  sx: { maxWidth: '10vw' },
  type: 'index',
};

export const STATUS_COL: TableHeader = {
  key: 'status',
  label: 'Status',
  render: (row) => React.createElement(TextStyle, { color: 'primary.main', weight: 600 }, row.status),
  sx: { maxWidth: '10vw' },
};

export const TABLE_HEADER_GROUP: TableHeader[] = [
  {
    key: 'noItemGroup',
    label: 'Nomor\nItem\nGroup',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'itemGroup',
    label: 'Description',
    render: (row) => React.createElement(TextStyle, { sx: { wordBreak: 'break-all' } }, truncateText(stripHtmlTags(row?.itemGroup ?? '-'), 35)),
    sx: { maxWidth: '10vw', minWidth: '10vw' },
  },
  {
    key: 'isActive',
    label: 'Active',
    render: (row) => React.createElement(TextStyle, null, row?.isActive ? 'Ya' : 'Tidak'),
    sx: { maxWidth: '10vw' },
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
];

export const TABLE_HEADER_ITEM: TableHeader[] = [
  {
    key: 'noItemGroup',
    label: 'Nomor\nItem\nGroup',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'noItem',
    label: 'Nomor Item',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'item',
    label: 'Description',
    render: (row) => React.createElement(TextStyle, { sx: { wordBreak: 'break-all' } }, truncateText(stripHtmlTags(row?.item ?? '-'), 35)),
    sx: { maxWidth: '10vw', minWidth: '10vw' },
  },
  {
    key: 'isActive',
    label: 'Active',
    render: (row) => React.createElement(TextStyle, null, row?.isActive ? 'Ya' : 'Tidak'),
    sx: { maxWidth: '10vw' },
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
];
export const TABLE_HEADER_SUBITEM: TableHeader[] = [
  {
    key: 'noItem',
    label: 'Nomor Item',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'noSubItem',
    label: 'Nomor\nSub\nItem',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'subItem',
    label: 'Description',
    render: (row) => React.createElement(TextStyle, { sx: { wordBreak: 'break-all' } }, truncateText(stripHtmlTags(row?.subItem ?? '-'), 35)),
    sx: { maxWidth: '10vw', minWidth: '10vw' },
  },
  {
    key: 'isActive',
    label: 'Active',
    render: (row) => React.createElement(TextStyle, null, row?.isActive ? 'Ya' : 'Tidak'),
    sx: { maxWidth: '10vw' },
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
];
