import { createElement } from 'react';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const DIVISI_OPTION = {
  DELST_DIVISION: 'DELST',
  DEPI_DIVISION: 'DEPI',
  DH_DIVISION: 'DH',
  DK_DIVISION: 'DK',
};

export const HISTORY_ASK_FOR_INFO_ITEM_STATUS = {
  ASK_FOR_INFO: 'ASK_FOR_INFO',
  BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV: 'BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV',
  BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_TL: 'BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_TL',
};

export const HISTORY_ASK_FOR_INFO_TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { width: '4%' },
    type: 'index',
  },
  {
    key: 'comment',
    label: 'Comment',
  },
  {
    key: 'statusLabel',
    label: 'Status',
    sx: { minWidth: '10vw' },
    type: 'status',
  },
  {
    key: 'createdBy',
    label: 'Created By',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'createdDate',
    label: 'Tanggal',
    sx: { minWidth: '8vw' },
    type: 'date',
  },
];
