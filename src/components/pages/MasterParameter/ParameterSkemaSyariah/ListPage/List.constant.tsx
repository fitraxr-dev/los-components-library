import { formatDate } from '@/helpers/date';

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
    key: 'product',
    label: 'Product',
    sx: {
      minWidth: '30vw',
    },
  },
  {
    key: 'isActive',
    label: 'Active',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'modifiedDate',
    label: 'Last Modified',
    render: (row) => (
      <TextStyle variant="body4">{row.modifiedDate ? formatDate(row.modifiedDate, 'DD MMM YYYY, HH:mm:ss') : '-'}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },


];

export const MODAL = {
  APPROVAL_STATUS_MODAL: 'APPROVAL_STATUS_MODAL',
};
