import { formatDate, formatDateTime } from '@/helpers/date';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


// export const TABLE_HEADER: TableHeader[] = [
//   {
//     key: 'index',
//     label: 'No',
//     type: 'index',
//   },
//   {
//     key: 'cif',
//     label: 'CIF',
//   },
//   {
//     key: 'debtorId',
//     label: 'Customer ID',
//   },
//   {
//     key: 'debtorName',
//     label: 'Nama Customer',
//   },
//   {
//     key: 'gamName',
//     label: 'General Account Manager',
//   },
//   {
//     key: 'modifiedAt',
//     label: 'Last Modified',
//     type: 'date',
//   },
//   {
//     key: 'modifiedBy',
//     label: 'Modified By',
//   },
// ];

export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { maxWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'debtorId',
    label: 'Customer ID',
    sx: { maxWidth: '8vw' },
  },
  {
    key: 'cif',
    label: 'CIF',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'institutionTypeLabel',
    label: 'Institution Type',
    sx: { maxWidth: '10vw' },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: { maxWidth: '12vw', wordWrap: 'break-word' },
  },
  {
    key: 'debtorIdDate',
    label: 'Tanggal ID Customer',
    sx: { maxWidth: '10vw' },
    type: 'date',
  },
  {
    key: 'cifDate',
    label: 'Tanggal CIF',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center" >
        {row.cifDate !== '-' ? formatDate(row.cifDate, 'D MMM YYYY, HH:mm:ss') : '-'}
      </TextStyle>
    ),
    sx: { maxWidth: '10vw' },
  },
];

export const mockNewTable = [
  {
    cif: '-',
    cifDate: '20-01-2025',
    debtorId: 'DEBT-00001',
    debtorIdDate: '20-01-2025',
    debtorName: 'John Doe',
  }
];

export const OLD_TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'processId',
    label: 'ID Process',
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
  },
  {
    key: 'financingCategory',
    label: 'Financing Category',
  },
  {
    key: 'facilityId',
    label: 'Facility ID',
  },
  {
    key: 'facilityNumber',
    label: 'Facility Number',
  },
  {
    key: 'status',
    label: 'Status',
  },
];

export const modal = {
  APPROVAL_MODAL: 'APPROVAL_MODAL',
};
