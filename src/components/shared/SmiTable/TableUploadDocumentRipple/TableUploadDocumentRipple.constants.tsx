import { toDateString } from '@/helpers/date';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const action = {
  TABLE_UPLOAD_DOCUMENT_DELETE: 'TABLE_UPLOAD_DOCUMENT_DELETE',
  TABLE_UPLOAD_DOCUMENT_DOWNLOAD: 'TABLE_UPLOAD_DOCUMENT_DOWNLOAD',
  TABLE_UPLOAD_DOCUMENT_EDIT: 'TABLE_UPLOAD_DOCUMENT_EDIT',
};

export const modal = {
  MODAL_DETAIL_DOCUMENT_RIPPLE: 'MODAL_DETAIL_DOCUMENT_RIPPLE',
  MODAL_UPLOAD_DOCUMENT_EXISTING: 'MODAL_UPLOAD_DOCUMENT_EXISTING',
  MODAL_UPLOAD_DOCUMENT_RIPPLE: 'MODAL_UPLOAD_DOCUMENT_RIPPLE',
};

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
    sx: {
      minWidth: '16vw',
    },
  },
  {
    key: 'documentType',
    label: 'Jenis Dokumen',
    sx: {
      minWidth: '16vw',
    },
  },
  {
    key: 'fileName',
    label: 'Nama Dokumen',
    render: (row) => {
      const fileName = row.fileName || row.documentName || '';
      const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
      return (
        <TextStyle variant="body4" textAlign="left">
          {nameWithoutExtension || '-'}
        </TextStyle>
      );
    },
    sx: {
      minWidth: '16vw',
      wordBreak: 'break-word',
    },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: {
      minWidth: '16vw',
    },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    render: (row) => (
      <TextStyle variant="body4">
        {row?.documentDate ? toDateString(row?.documentDate) : '-'}
      </TextStyle>
    ),
  },
  {
    key: 'createdBy',
    label: 'Uploaded By',
  },
  {
    key: 'divisionLabel',
    label: 'Divisi',
    sx: {
      minWidth: '16vw',
    },
  },
  {
    key: 'createdDate',
    label: 'Uploaded Date',
    render: (row) => (
      <TextStyle variant="body4">
        {row?.createdDate ? toDateString(row?.createdDate) : '-'}
      </TextStyle>
    ),
  },
];
