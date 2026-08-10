import TextStyle from '@/components/shared/TextStyle';

import type { TableHeaderVerification } from '../components/TableDocumentVerification/TableDocumentVerification.types';


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
    sx: { lineHeight: '1.6', width: '30vw' },
    type: 'textHtml',
  },
];

export const tableHeaderChild: Array<TableHeaderVerification> = [
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { lineHeight: '1.6', width: '30vw' },
    type: 'isChild',
  },
];


export const tableHeaderGrandChild: Array<TableHeaderVerification> = [
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { lineHeight: '1.6', width: '30vw' },
    type: 'isGrandChild',
  },
];
