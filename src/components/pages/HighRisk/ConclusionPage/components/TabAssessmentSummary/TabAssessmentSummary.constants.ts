import type { TableHeaderVerification } from './components/TableDocumentVerification/TableDocumentVerification.types';


export const tableHeaderList: TableHeaderVerification[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'document',
    label: 'Kriteria Risiko Calon Customer / Customer / Pemilik Manfaat (Beneficial Owner)',
    sx: { lineHeight: '1.6', maxWidth: '16vw', overflowWrap: 'break-word' },
    type: 'textHtml',
  },
];

export const tableHeaderChild: TableHeaderVerification[] = [
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { lineHeight: '1.6', maxWidth: '3vw', overflowWrap: 'break-word' },
    type: 'textHtml',
  },
];

export const tableHeaderGrandChild: TableHeaderVerification[] = [
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { lineHeight: '1.6', maxWidth: '3vw', overflowWrap: 'break-word' },
    type: 'textHtml',
  },
];
