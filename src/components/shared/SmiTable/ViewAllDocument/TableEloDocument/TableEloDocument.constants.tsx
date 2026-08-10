import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const MODAL_UPLOAD_DOCUMENT_ELO = 'MODAL_UPLOAD_DOCUMENT_ELO';

export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'documentGroupLabel',
    label: 'Group Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'isConvenant',
    label: 'Covenant/Non Covenant',
    render: (row) => {
      if (row.isConvenant === null || row.isConvenant === undefined) {
        return (
          <TextStyle variant="body4" textAlign="left">
            -
          </TextStyle>
        );
      }
      return (
        <TextStyle variant="body4" textAlign="left">
          {row.isConvenant ? 'Covenant' : 'Non Covenant'}
        </TextStyle>
      );
    },
    sx: {
      minWidth: '10vw',
    },
    type: 'boolean',
  },
  {
    key: 'documentType',
    label: 'Jenis Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'noPK',
    label: 'No PK',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'description',
    label: 'Perihal',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'article',
    label: 'Pasal/Ayat',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'rm',
    label: 'Staff',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'dpop',
    label: 'DPOP',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'fileName',
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
      minWidth: '10vw',
    },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    sx: {
      minWidth: '10vw',
    },
    type: 'date-only',
  },
  {
    key: 'deadlineDate',
    label: 'Tanggal Jatuh Tempo',
    sx: {
      minWidth: '12vw',
    },
    type: 'date-only',
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    sx: {
      minWidth: '8vw',
    },
    type: 'date-only',
  },
  {
    key: 'createdBy',
    label: 'Uploaded By',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'createdDate',
    label: 'Uploaded Date',
    sx: {
      minWidth: '8vw',
    },
    type: 'date-only',
  },
];
