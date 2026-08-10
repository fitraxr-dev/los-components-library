import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '../components/TreeTableDraftOL/TreeTableDraftOL.types';


export const TABLE_HEADER: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'documentType',
    label: 'Jenis Dokumen',
    sx: {
      maxWidth: '180px',
    },
  },
  {
    key: 'documentName',
    label: 'Nama Dokumen',
    sx: {
      maxWidth: '180px',
    },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
  },
];

export const TABLE_HEADER_OL: Array<TableHeader> = [
  {
    headerSx: {
      textAlign: 'center',
      verticalAlign: 'middle',
      width: '1.2rem',
    },
    key: 'no',
    label: 'No',
    sx: {
      width: '1.2rem',
    },
  },
  {
    headerSx: {
      minWidth: '20%',
      textAlign: 'center',
      verticalAlign: 'middle',
    },
    key: 'noOl',
    label: 'No. Draft',
    // render: (row) => (
    //   <TextStyle variant="body4" textAlign="center">
    //     {row.status === 'COMPLY' ? row.noDraf : ''}
    //   </TextStyle>
    // ),
  },
  {
    key: 'date',
    label: 'Tanggal',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'isCustomerBanding',
    label: 'Customer Banding',
    type: 'checkbox',
    // isDisabled and onSelectChange will be set dynamically in UploadOfferingLetter.tsx
  }
];

export const modal = {
  MODAL_ADD_DRAFT_OL: 'MODAL_ADD_DRAFT_OL',
  MODAL_ADD_OL: 'MODAL_ADD_OL',
  MODAL_DETAIL_DRAFT_OL: 'MODAL_DETAIL_DRAFT_OL',
  MODAL_FINAL_DRAFT_OL: 'MODAL_FINAL_DRAFT_OL',
  MODAL_UPLOAD_DOCUMENT: 'MODAL_UPLOAD_DOCUMENT',
  OFFERING_LETTER_DETAIL: 'OFFERING_LETTER_DETAIL',
};
