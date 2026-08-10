import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_DOCUMENT: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'documentGroup',
    label: 'Group Dokumen',
  },
  {
    key: 'documentType',
    label: 'Jenis Dokumen',
  },
  {
    key: 'documentName',
    label: 'Nama Dokumen',
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
  },
  {
    key: 'uploadedBy',
    label: 'Uploaded By',
  },
  {
    key: 'division',
    label: 'Divisi',

  },
  {
    key: 'uploadedDate',
    label: 'Uploaded Date',
  },
  {
    key: 'status',
    label: 'Status',
  },
];

export const TABLE_HEADER: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { width: '4%' },
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

export const modal = {
  MODAL_ADD_PERIHAL: 'MODAL_ADD_PERIHAL',
  MODAL_UPLOAD_DOCUMENT: 'MODAL_UPLOAD_DOCUMENT',
};

export const STATUS_SPFP = {
  SPFP_ASK_FOR_INFO: 'SPFP_ASK_FOR_INFO',
  SPFP_ASK_FOR_INFO_DPOP_RETURN_TL_MAKER: 'SPFP_ASK_FOR_INFO_DPOP_RETURN_TL_MAKER',
  SPFP_ASK_FOR_INFO_DPOP_WAITING_CHECKER: 'SPFP_ASK_FOR_INFO_DPOP_WAITING_CHECKER',
  SPFP_ASK_FOR_INFO_DPOP_WAITING_KADIV: 'SPFP_ASK_FOR_INFO_DPOP_WAITING_KADIV',
  SPFP_ASK_FOR_INFO_DPOP_WAITING_KADIV_MAKER: 'SPFP_ASK_FOR_INFO_DPOP_WAITING_KADIV_MAKER',
  SPFP_ASK_FOR_INFO_DPOP_WAITING_TL: 'SPFP_ASK_FOR_INFO_DPOP_WAITING_TL',
  SPFP_ASK_FOR_INFO_RETURN_MAKER: 'SPFP_ASK_FOR_INFO_RETURN_MAKER',
  SPFP_ASK_FOR_INFO_WAITING_KADIV: 'SPFP_ASK_FOR_INFO_WAITING_KADIV',
  SPFP_ASK_FOR_INFO_WAITING_KADIV_EDITED: 'SPFP_ASK_FOR_INFO_WAITING_KADIV_EDITED',
  SPFP_ASK_FOR_INFO_WAITING_KADIV_MAKER: 'SPFP_ASK_FOR_INFO_WAITING_KADIV_MAKER',
  SPFP_ASK_FOR_INFO_WAITING_TL: 'SPFP_ASK_FOR_INFO_WAITING_TL',
  SPFP_REVISION_ASK_FOR_INFO_WAITING_KADIV: 'SPFP_REVISION_ASK_FOR_INFO_WAITING_KADIV',
  SPFP_WAITING_APPROVAL_CHECKER_ASK_FOR_INFO: 'SPFP_WAITING_APPROVAL_CHECKER_ASK_FOR_INFO',
};
