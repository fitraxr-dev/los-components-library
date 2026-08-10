import { createElement } from 'react';

import { TypeProcess } from '@/enums/Module';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ButtonProps } from '@mui/material';


export const REVIEW_MONITORING_ITEM_STATUS = {
  ASK_FOR_INFO: 'ASK_FOR_INFO',
  ASK_FOR_INFO_APPROVAL_KADIV: 'APPROVAL_KADIV_BISNIS_ASK_FOR_INFO',
  ASK_FOR_INFO_APPROVAL_TL: 'APPROVAL_TL_ASK_FOR_INFO',
  BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_CHECKER: 'BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_CHECKER',
  BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV: 'BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV',
  BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV_MAKER: 'BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV_MAKER',
  BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_TL: 'BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_TL',
  COMPLETED: 'COMPLETED',
  DELST_COMPLETED: 'DELST_COMPLETED',
  DEPI_COMPLETED: 'DEPI_COMPLETED',
  DEPI_WAITING_ASK_FOR_INFO_APPROVAL_KADIV: 'DEPI_WAITING_ASK_FOR_INFO_APPROVAL_KADIV',
  DEPI_WAITING_ASK_FOR_INFO_APPROVAL_TL: 'DEPI_WAITING_ASK_FOR_INFO_APPROVAL_TL',
  DEPI_WAITING_ASK_FOR_INFO_FROM_BUSINESS: 'DEPI_WAITING_ASK_FOR_INFO_FROM_BUSINESS',
  DEPI_WAITING_UPDATE_FROM_BUSINESS_APPROVAL_KADIV: 'DEPI_WAITING_UPDATE_FROM_BUSINESS_APPROVAL_KADIV',
  DEPI_WAITING_UPDATE_FROM_BUSINESS_APPROVAL_TL: 'DEPI_WAITING_UPDATE_FROM_BUSINESS_APPROVAL_TL',
  DH_COMPLETED: 'DH_COMPLETED',
  DK_COMPLETED: 'DK_COMPLETED',
};

export const REVIEW_MONITORING_ASK_FOR_INFO = [
  REVIEW_MONITORING_ITEM_STATUS.ASK_FOR_INFO,
  REVIEW_MONITORING_ITEM_STATUS.BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV,
  REVIEW_MONITORING_ITEM_STATUS.BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_TL,
  REVIEW_MONITORING_ITEM_STATUS.DEPI_WAITING_ASK_FOR_INFO_APPROVAL_KADIV,
  REVIEW_MONITORING_ITEM_STATUS.DEPI_WAITING_ASK_FOR_INFO_APPROVAL_TL,
  REVIEW_MONITORING_ITEM_STATUS.DEPI_WAITING_ASK_FOR_INFO_FROM_BUSINESS,
];

export const REVIEW_MONITORING_CHILD_FILTER: string[] = [
  TypeProcess.REVIEWER_DEPI, TypeProcess.REVIEWER_DH, TypeProcess.REVIEWER_DK, TypeProcess.REVIEWER_DELST
];

export type SUBMIT_ACTION = 'DECLINE' | 'SUBMIT' | 'CREATE_MEMO_SUPP' | 'REVISION' | 'RETURN_TO_STAFF'

const REVIEW_MONITORING_PROCESS_NAME = {
  REVIEWER_DELST: 'Review Kajian Lingkungan',
  REVIEWER_DEPI: 'Rating Proses dan Review Kelayakan Pembiayaan',
  REVIEWER_DH: 'Review Legal Aspek dan hukum',
  REVIEWER_DK: 'Review Kepatuhan Syariah',
};

export const DIVISI_OPTION = {
  DELST_DIVISION: 'DELST',
  DEPI_DIVISION: 'DEPI',
  DH_DIVISION: 'DH',
  DK_DIVISION: 'DK',
};

export type TitleButtons = {
  label: string;
  onClick?: () => void;
  isLoading?: boolean;
  color?: ButtonProps['color'];
  variant?: ButtonProps['variant'];
}

export const REVIEW_MONITORING_TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { width: '4%' },
    type: 'index',
  },
  {
    key: 'reviewProcess',
    label: 'Proses Review',
    render: (row) => (
      createElement(TextStyle, { variant: 'body4' }, REVIEW_MONITORING_PROCESS_NAME[row.process] ?? '-')
    ),
    sx: { minWidth: '12vw' },
  },
  {
    key: 'division',
    label: 'Divisi',
  },
  {
    key: 'pic',
    label: 'PIC',
    render: (row, idx) => {
      const rowPic = row.pic;
      if (Array.isArray(rowPic)) {
        const names = rowPic.map((obj) => obj.name);
        return createElement(TextStyle, { variant: 'body4' }, names.length > 0 ? names.join(', ') : '-');
      } else {
        return createElement(TextStyle, { variant: 'body4' }, row.name ?? '-');
      }
    },
    sx: { minWidth: '5vw' },
  },
  {
    key: 'createdAt',
    label: 'Start Date',
    sx: { minWidth: '8vw' },
    type: 'date',
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: { minWidth: '5vw' },
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    sx: { minWidth: '8vw' },
    type: 'date',
  },
  {
    key: 'statusLabel',
    label: 'Status',
    sx: { minWidth: '5vw' },
    type: 'status',
  },
];
