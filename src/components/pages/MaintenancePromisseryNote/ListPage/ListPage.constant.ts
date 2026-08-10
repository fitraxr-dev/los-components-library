import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'Customer',
    label: 'ID',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'seq',
    label: 'Seq',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'bonds',
    label: 'Bonds',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'issuer',
    label: 'Issuer',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'maturityDate',
    label: 'Maturity Date',
    sx: { minWidth: '10vw' },
    type: 'date',
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
    sx: { minWidth: '10vw' },
    type: 'date',
  },
  {
    key: 'currency',
    label: 'Currency',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'faceValue',
    label: 'Face Value',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'statusData',
    label: 'Status Data',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'faceValueInIDR',
    label: 'Face Value in IDR',
    sx: { minWidth: '10vw' },
  },
];
