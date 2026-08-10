import TextStyle from '@/components/shared/TextStyle';

import type { TableHeaderVerification } from '../components/TableDocumentVerification/TableDocumentVerification.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  CUSTOMER_COMMENT: 'CUSTOMER_COMMENT',
  CUSTOMER_DECLINE: 'CUSTOMER_DECLINE',
  GENERATE_DRAFT_MEMO_CUSTOMER: 'GENERATE_DRAFT_MEMO_CUSTOMER',
};

export const tableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      width: '3%',
    },
    type: 'index',
  },
  {
    key: 'document',
    label: 'Kriteria Risiko Calon Customer / Customer / Pemilik Manfaat (Beneficial Owner)',
    sx: {
      paddingX: '16px !important',
      width: '45%',
    },
    type: 'textHtml',
  },
];


export const tableHeaderParent: Array<TableHeaderVerification> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      width: '1vw',
    },
    type: 'index',
  },
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { lineHeight: '1.6', maxWidth: '3vw', overflowWrap: 'break-word' },
    type: 'textHtml',
  },
];

export const tableHeaderChild: Array<TableHeaderVerification> = [
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { lineHeight: '1.6', maxWidth: '3vw', overflowWrap: 'break-word' },
    type: 'textHtml',
  },
];


export const tableHeaderGrandChild: Array<TableHeaderVerification> = [
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { lineHeight: '1.6', maxWidth: '3vw', overflowWrap: 'break-word' },
    type: 'textHtml',
  },
];


export const FORWARD_SUBMIT_HIGH_RISK = 'FORWARD_SUBMIT_HIGH_RISK';
export const FORWARD_TO_DK = 'FORWARD_TO_DK';
export const FORWARD_TO_DPOP = 'FORWARD_TO_DPOP';


export const listTitleModalSubmitBucket = [
  {
    action: 'CANCELED',
    title: 'Data berhasil dicancel',
  },
  {
    action: 'REJECTED',
    title: 'Data berhasil direject',
  },
];
