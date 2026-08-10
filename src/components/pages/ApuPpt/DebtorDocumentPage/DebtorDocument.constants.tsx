import TextStyle from '@/components/shared/TextStyle';

import type { TableHeaderVerification } from '../components/TableDocumentVerification/TableDocumentVerification.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: Array<TableHeader> = [
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
    sx: { marginRight: '10px', textAlign: 'justify', width: '12.5vw' },
    type: 'textHtml',
  },
];


export const documentTypeQs = {
  'CORPORATE_CORPORATION': 'corporate-corporation',
  'CORPORATE_CORPORATION_NEW': 'corporate-corporation-new',
  'FOUNDATION': 'foundation',
  'GOVERMENT_AGENCY': 'goverment-agency',
  'LEGAL_ENTITY': 'legal-entity',
  'PUBLIC_SERVICES_AGENCY': 'public-services-agency',
};

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
