import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'ROLE',
    label: 'Role',
  },
  {
    key: 'DIVISI',
    label: 'Divisi',
  },
  {
    key: 'ACCESS',
    label: 'Access',
  },
];


export const TABLE_HEADER_PARENT: TableHeader[] = [

  {
    key: 'typeLabel',
    label: 'Tipe',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.typeLabel || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'name',
    label: 'Nama Shareholder',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.name || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'shares',
    label: 'Lembar Saham',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.shares || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'percentage',
    label: '%',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.percentage}%
      </TextStyle>
    ),
  },
  {
    key: 'beneficialOwner',
    label: 'Beneficial Owner',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.beneficialOwner || '-'}
      </TextStyle>
    ),
  },
];

export const TABLE_HEADER_NESTED_CHILD: TableHeader[] = [
  {
    key: 'parentName',
    label: 'Nama Shareholder Tingkat Sebelumnya',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.parentName || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'typeLabel',
    label: 'Tipe',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.typeLabel || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'name',
    label: 'Nama Shareholder',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.name || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'shares',
    label: 'Lembar Saham',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.shares || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'percentage',
    label: '%',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.percentage}%
      </TextStyle>
    ),
  },
  {
    key: 'beneficialOwner',
    label: 'Beneficial Owner',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.beneficialOwner || '-'}
      </TextStyle>
    ),
  },
];


export const modal = {
  SHAREHOLDER_MODAL_DETAIL: 'SHAREHOLDER_MODAL_DETAIL',
  STRUCTURE_MODAL: 'STRUCTURE_MODAL',
};


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'shareholderId',
    label: 'ID Ref',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.shareholderId || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'institutionTypeLabel',
    label: 'Tipe',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.institutionTypeLabel || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'name',
    label: 'Nama',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.name || '-'}
      </TextStyle>
    ),
  },

  {
    key: 'sheets',
    label: 'Lembar Saham',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.sheets || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'percentage',
    label: '%',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.percentage || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'lastCheckedDate',
    label: 'Last Checked Date',
    type: 'date',
  },
];
