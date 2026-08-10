import { toDateString } from '@/helpers/date';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  DOCUMENT_DETAIL: 'DOCUMENT_DETAIL',
  MODAL_UPLOAD_DOCUMENT: 'MODAL_UPLOAD_DOCUMENT',
};

export const PREVIEW_FORMAT = ['jpg', 'jpeg', 'png', 'mp4', 'pdf'];

export const TABLE_HEADER_UPLOAD_DOCUMENT: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { width: '4%' },
    type: 'index',
  },
  {
    key: 'documentGroupLabel',
    label: 'Group Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'documentTypeLabel',
    label: 'Jenis Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'fileName',
    label: 'Nama Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    render: (row) => (
      <TextStyle variant="body4">
        {row?.documentDate ? toDateString(row?.documentDate) : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '10vw' },
  },
  {
    key: 'createdBy',
    label: 'Uploaded By',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'createdDate',
    label: 'Uploaded Date',
    render: (row) => (
      <TextStyle variant="body4">
        {row?.createdDate ? toDateString(row?.createdDate) : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '10vw' },
  },
];
