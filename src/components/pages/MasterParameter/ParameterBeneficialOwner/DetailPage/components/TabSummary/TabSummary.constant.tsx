import * as React from 'react';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


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
    sx: { maxWidth: '10vw' },
    type: 'textHtml',
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
    sx: { maxWidth: '10vw' },
    type: 'textHtml',
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
    label: 'Nomor Sub Item',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'subItem',
    label: 'Description',
    sx: { maxWidth: '10vw' },
    type: 'textHtml',
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
