import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_PARENT: TableHeader[] = [

  {
    key: 'typeLabel',
    label: 'Tipe',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.typeLabel}
      </TextStyle>
    ),
  },
  {
    key: 'shareholderCode',
    label: 'Nama Shareholder',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center">
        {row.shareholderCode || '-'}
      </TextStyle>
    ),
  },
  {
    key: 'ACCESS',
    label: 'Lembar Saham',
  },
  {
    key: 'ACCESS',
    label: '%',
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
