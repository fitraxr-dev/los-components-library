import * as React from 'react';

import TextStyle from '@/components/shared/TextStyle';

import type {
  TableHeaderVerification,
} from '@/components/shared/SmiTable/TableDocumentVerification/TableDocumentVerification.types';


const commonTableHeader: TableHeaderVerification[] = [
  {
    key: 'assessmentSummary',
    label: 'Assessment\nSummary',
    render: (row) => React.createElement(TextStyle, { textAlign: 'center', variant: 'body4' }, !row?.needConfirmation ? '' : row.assessmentSummary ? 'Ya' : row.assessmentSummary === null ? '-' : 'Tidak'),
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'action',
    label: 'Action',
    options: (row) => [
      ...(row.needConfirmation ? [{
        iconName: 'edit',
        isDisabled: true,
        onClick: undefined,
      }] : [])
    ],
    sx: { maxWidth: '10vw' },
    type: 'action',
  }
];

export const tableHeaderParent: TableHeaderVerification[] = [
  {
    key: 'index',
    label: 'No',
    sx: { maxWidth: '10vw' },
    type: 'index',
  },
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { lineHeight: '1.6' },
    type: 'textHtml',
  },
  ...commonTableHeader
];

export const tableHeaderChild: TableHeaderVerification[] = [
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { lineHeight: '1.6' },
    type: 'isChild',
  },
  ...commonTableHeader
];


export const tableHeaderGrandChild: TableHeaderVerification[] = [
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { lineHeight: '1.6' },
    type: 'isGrandChild',
  },
  ...commonTableHeader
];
