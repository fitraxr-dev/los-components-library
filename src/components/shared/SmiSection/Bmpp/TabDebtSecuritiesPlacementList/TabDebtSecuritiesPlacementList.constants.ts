import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'sequence',
    label: 'Seq',
    sx: { minWidth: '6vw' },
  },
  {
    key: 'bonds',
    label: 'Bonds',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'issuer',
    label: 'Issuer',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'maturityDate',
    label: 'Maturity Date',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'currency',
    label: 'Currency',
    sx: { minWidth: '6vw' },
  },
  {
    key: 'faceValue',
    label: 'Face Value',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'faceValueIdr',
    label: 'Face Value in IDR',
    sx: { minWidth: '8vw' },
  },
];

export const tableHeaderGroup: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'debtorName',
    label: 'Customer',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'seq',
    label: 'Seq',
    sx: { minWidth: '6vw' },
  },
  {
    key: 'bonds',
    label: 'Bonds',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'issuer',
    label: 'Issuer',
    sx: { minWidth: '9vw' },
  },
  {
    key: 'maturityDate',
    label: 'Maturity Date',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'currFaceValue',
    label: 'Currency',
    sx: { minWidth: '6vw' },
  },
  {
    key: 'faceValue',
    label: 'Face Value',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'faceValueInIdr',
    label: 'Face Value in IDR',
    sx: { minWidth: '8vw' },
  },
];
