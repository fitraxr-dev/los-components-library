import * as React from 'react';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const ITEM_MODAL_IDS = {
  SUBITEM_MODAL: 'SUBITEM_MODAL',
};

const truncateText = (value, maxLength = 100) => {
  // eslint-disable-next-line eqeqeq
  const str = value == null ? '' : String(value);
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, '');
};

export const TABLE_HEADER_SUBITEM: TableHeader[] = [
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
    key: 'needConfirmation',
    label: 'Show\nButton\nEdit',
    render: (row) => React.createElement(TextStyle, null, row?.needConfirmation ? 'Ya' : 'Tidak'),
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'additionalAction',
    label: 'To\nMaintenance\nCustomer',
    render: (row) => React.createElement(TextStyle, null, row?.additionalAction ? 'Ya' : 'Tidak'),
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'createdBy',
    label: 'Created By',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    sx: { maxWidth: '10vw' },
    type: 'date',
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
