import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const formatTableCell = (value, maxLength = 50) => {

  const stringValue = String(value);
  if (stringValue.length > maxLength) {
    return `${stringValue.substring(0, maxLength)}...`;
  }
  return stringValue;
};

function stripHtmlTags(htmlString) {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  return doc.body.textContent || '';
}

export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'bucketProcessId',
    label: 'ID Process',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'productName',
    label: 'Product',
    sx: {
      minWidth: '16vw',
    },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'modifiedDate',
    label: 'Last Modified',
    sx: {
      minWidth: '12vw',
    },
    type: 'date',
  },
  {
    key: 'statusLabel',
    label: 'Status',
    sx: {
      minWidth: '8vw',
    },
    type: 'status',
  },
];
