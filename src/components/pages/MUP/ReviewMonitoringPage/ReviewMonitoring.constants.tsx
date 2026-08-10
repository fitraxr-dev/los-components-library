import { toDateString } from '@/helpers/date';

import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const reviewMonitoringItemStatus = {
  APPROVAL_KADIV_BISNIS_ASK_FOR_INFO: 'APPROVAL_KADIV_BISNIS_ASK_FOR_INFO',
  APPROVAL_TL_ASK_FOR_INFO: 'APPROVAL_TL_ASK_FOR_INFO',
  ASK_FOR_INFO: 'ASK_FOR_INFO',
  BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV: 'BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV',
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

export const reviewMonitoringAskForInfoRm = [
  reviewMonitoringItemStatus.ASK_FOR_INFO,
  reviewMonitoringItemStatus.DEPI_WAITING_ASK_FOR_INFO_FROM_BUSINESS,
];

const reviewMonitoringProcessName = {
  REVIEWER_DELST: 'Review Kajian Lingkungan',
  REVIEWER_DEPI: 'Rating Proses dan Review Kelayakan Pembiayaan',
  REVIEWER_DH: 'Review Legal Aspek dan hukum',
  REVIEWER_DK: 'Review Kepatuhan Syariah',
  REVIEWER_DPOP: 'Review Aspek Agunan LPA',
};

export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'reviewProcess',
    label: 'Proses Review',
    render: (row) => (
      <TextStyle variant="body4">{reviewMonitoringProcessName[row.process] ?? '-'}</TextStyle>
    ),
    sx: { minWidth: '12vw' },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'pic',
    label: 'PIC',
    render: (row, idx) => {
      const rowPic = row.pic;
      if (Array.isArray(rowPic)) {
        const names = rowPic.map((obj) => obj.name);
        return (
          <TextStyle variant="body4">{names.length > 0 ? names.join(', ') : '-'}</TextStyle>
        );
      } else {
        return (
          <TextStyle variant="body4">{row.name ?? '-'}</TextStyle>
        );
      }
    },
    sx: { minWidth: '10vw' },
  },
  {
    key: 'requestDate',
    label: 'Start Date',
    render: (row) => (
      <TextStyle variant="body4">{row.createdAt ? toDateString(row.createdAt) : '-'}</TextStyle>
    ),
    sx: { minWidth: '10vw' },
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    render: (row) => (
      <TextStyle variant="body4">{row.dueDate ? toDateString(row.dueDate) : '-'}</TextStyle>
    ),
    sx: { minWidth: '10vw' },
  },
  {
    key: 'status',
    label: 'Status',
    type: 'status',
  },
];
