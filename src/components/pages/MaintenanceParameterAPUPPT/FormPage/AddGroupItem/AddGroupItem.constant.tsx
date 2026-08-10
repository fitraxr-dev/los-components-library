import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';

// Helper function to strip HTML tags and decode HTML entities
const stripHtmlTags = (html: string): string => {
  if (!html) return '';

  // Remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  const decoded = withoutTags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&nbsp;/g, ' ');

  return decoded.trim();
};

// Helper function to truncate text
const truncateText = (value: any, maxLength = 100) => {
  // eslint-disable-next-line eqeqeq
  const str = value == null ? '' : String(value);
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { width: '5vw' },
    type: 'index',
  },
  {
    key: 'itemNo',
    label: 'Nomor Item',
    sx: { width: '10vw' },
  },
  {
    key: 'item',
    label: 'Item',
    render: (row) => (
      <TextStyle sx={{ wordBreak: 'break-all' }}>
        {truncateText(stripHtmlTags(row.item), 35)}
      </TextStyle>
    ),
    sx: { maxWidth: '10vw', minWidth: '10vw' },
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

// Hardcoded options for Nomor Item Group dropdown
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
