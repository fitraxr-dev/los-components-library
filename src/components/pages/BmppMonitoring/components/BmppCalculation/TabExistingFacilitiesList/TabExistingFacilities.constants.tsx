import * as Yup from 'yup';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const validationSchema = Yup.object({
  currencyValue: Yup.object().shape({
    currency: Yup.string().required(),
    value: Yup.number().required(),
  }).required('Nominal is required'),
});


export const tableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '2.5vw' },
    type: 'index',
  },
  {
    key: 'facilityId',
    label: 'Facility No',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'product',
    label: 'Product',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'revolving',
    label: 'Revolving/ Non Revolving',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'guaranty',
    label: 'Penjaminan/ Penugasan',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'plafondExisting',
    label: 'Plafond',
    render: (row) => (
      <TextStyle variant="body4">
        {row.plafondExisting ? `${row.currencyPlafond ? row.currencyPlafond : ''} ${row.plafondExisting}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'outstanding',
    label: 'O/S',
    render: (row) => (
      <TextStyle variant="body4">
        {row.outstanding ? `${row.currencyPlafond ? row.currencyPlafond : ''} ${row.outstanding}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'leeway',
    label: 'Kelonggaran Tarik',
    render: (row) => (
      <TextStyle variant="body4">
        {row.leeway ? `${row.currencyPlafond ? row.currencyPlafond : ''} ${row.leeway}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'plafondExistingInIdr',
    label: 'Plafond in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.plafondExistingInIdr ? `IDR ${row.plafondExistingInIdr}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'outstandingIdr',
    label: 'O/S in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.outstandingIdr ? `IDR ${row.outstandingIdr}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'leewayInIdr',
    label: 'Kelonggaran Tarik in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.leewayInIdr ? `IDR ${row.leewayInIdr}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'endApDate',
    label: 'End AP Date',
    sx: { minWidth: '8vw', textAlign: 'center' },
  },
  {
    key: 'maturityDate',
    label: 'Maturity Date',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'division',
    label: 'Division',
    sx: { minWidth: '8vw' },
  },
];

export const tableGroupHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '2.5vw' },
    type: 'index',
  },
  {
    key: 'customerName',
    label: 'Cust. Name',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'facilityId',
    label: 'Facility No',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'product',
    label: 'Product',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'revolving',
    label: 'Revolving/ Non Revolving',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'guaranty',
    label: 'Penjaminan/ Penugasan',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'plafondExisting',
    label: 'Plafond',
    render: (row) => (
      <TextStyle variant="body4">
        {row.plafondExisting ? `${row.currencyPlafond ? row.currencyPlafond : ''} ${row.plafondExisting}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'outstanding',
    label: 'O/S',
    render: (row) => (
      <TextStyle variant="body4">
        {row.outstanding ? `${row.currencyPlafond ? row.currencyPlafond : ''} ${row.outstanding}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'leeway',
    label: 'Kelonggaran Tarik',
    render: (row) => (
      <TextStyle variant="body4">
        {row.leeway ? `${row.currencyPlafond ? row.currencyPlafond : ''} ${row.leeway}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'plafondExistingInIdr',
    label: 'Plafond in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.plafondExistingInIdr ? `IDR ${row.plafondExistingInIdr}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'outstandingIdr',
    label: 'O/S in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.outstandingIdr ? `IDR ${row.outstandingIdr}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'leewayInIdr',
    label: 'Kelonggaran Tarik in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.leewayInIdr ? `IDR ${row.leewayInIdr}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '14vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'endApDate',
    label: 'End AP Date',
    sx: { minWidth: '8vw', textAlign: 'center' },
  },
  {
    key: 'maturityDate',
    label: 'Maturity Date',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'division',
    label: 'Division',
    sx: { minWidth: '8vw' },
  },
];
