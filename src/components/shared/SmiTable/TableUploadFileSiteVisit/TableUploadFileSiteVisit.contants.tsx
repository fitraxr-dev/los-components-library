import { toDateString } from '@/helpers/date';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  FILE_DETAIL: 'FILE_DETAIL',
  MODAL_UPLOAD_FILE: 'MODAL_UPLOAD_FILE',
};

export const TABLE_HEADER_UPLOAD_FILE: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { width: '4%' },
    type: 'index',
  },
  {
    key: 'documentName',
    label: 'Nama File',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'documentExtension',
    label: 'Type File',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'createdBy',
    label: 'Uploaded By',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'documentDate',
    label: 'Uploaded Date',
    render: (row) => (
      <TextStyle variant="body4">
        {row?.documentDate ? toDateString(row?.documentDate) : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '10vw' },
  },
];
