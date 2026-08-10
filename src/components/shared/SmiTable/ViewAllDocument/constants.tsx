import { formatDateTime } from '@/helpers/date';

import TextStyle from '../../TextStyle';

import type { TableHeader } from '../../Table/Table.types';


export const DIGITAL_MEMO = 'DIGITAL_MEMO';
export const FINANCING_DOCUMENT = 'FINANCING_DOCUMENT';
export const SUPPORTING_DOCUMENTS = 'SUPPORTING_DOCUMENTS';
export const PREVIEW_FORMAT = ['jpg', 'jpeg', 'jpe', 'png', 'mp4', 'pdf', 'docx', 'doc', 'xlsx', 'xls', 'ppt', 'pptx', 'tif', 'gif', 'mp3'];

export const TABLE_HEADER: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
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
    // diSimpen buat sewaktu waktu berubah permintaan qa riris & adit ba 01-16-2025
    key: 'fileName',
    // key: 'documentName',
    label: 'Nama Dokumen',
    render: (row) => {
      const fileName = row.fileName || row.documentName || '';
      // Remove file extension
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
    sx: {
      minWidth: '16vw',
    },
  },
];

export const modal = {
  DOCUMENT_DETAIL: 'DOCUMENT_DETAIL',
  MODAL_UPLOAD_DOCUMENT: 'MODAL_UPLOAD_DOCUMENT',
  MODAL_UPLOAD_DOCUMENT_EXISTING: 'MODAL_UPLOAD_DOCUMENT_EXISTING',
};
