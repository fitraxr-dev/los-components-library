import { usePathname } from 'next/navigation';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


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
  STRUCTURE_ADD_MODAL: 'STRUCTURE_ADD_MODAL',
  STRUCTURE_DELETE_MODAL: 'STRUCTURE_DELETE_MODAL',
  STRUCTURE_MODAL: 'STRUCTURE_MODAL',
};


export const GetAccessEdit = (stepper: any) => {
  const pathname = usePathname();
  const getPath = (path: string) => {
    if (!path) return;
    const arr = path.split('/');
    const result = arr[arr.length - 2];
    return result;
  };

  return stepper.steps.find((step) => step.urlPath === 'management-shareholder')?.childrenSteps
    .find((step) => step.urlPath === getPath(pathname))?.enable;
};
