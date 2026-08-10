import * as React from 'react';

import TextStyle from '@/components/shared/TextStyle';

import type {
  TableHeaderVerification,
} from '@/components/shared/SmiTable/TableDocumentVerification/TableDocumentVerification.types';


const commonTableHeader: TableHeaderVerification[] = [
  {
    key: 'businessCheck',
    label: 'Check Bisnis',
    render: (row) => React.createElement(TextStyle, { textAlign: 'center', variant: 'body4' }, !row?.needConfirmation ? '' : row.isBusinessCheck ? 'Ya' : row.isBusinessCheck === null ? '-' : 'Tidak'),
    sx: { width: '10vw' },
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
    sx: { width: '10vw' },
    type: 'action',
  }
];

export const tableHeaderParent: TableHeaderVerification[] = [
  {
    key: 'index',
    label: 'No',
    sx: { width: '10vw' },
    type: 'index',
  },
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { width: '10vw' },
    type: 'textHtml',
  },
  ...commonTableHeader
];

export const tableHeaderChild: TableHeaderVerification[] = [
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { width: '10vw' },
    type: 'isChild',
  },
  ...commonTableHeader
];


export const tableHeaderGrandChild: TableHeaderVerification[] = [
  {
    key: 'document',
    label: 'Informasi / Dokumen yang Diverifikasi',
    sx: { width: '10vw' },
    type: 'isGrandChild',
  },
  ...commonTableHeader
];
