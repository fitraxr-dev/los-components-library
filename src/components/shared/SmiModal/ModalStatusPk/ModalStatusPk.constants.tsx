import TextStyle from '../../TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeader: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'pkName',
    label: 'Nama PK',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'signingConditions',
    label: 'Syarat Penandatanganan',
    render: (row) => (
      <TextStyle>
        {
          row.signingConditions === '-' || row.signingConditions === null
            ? '-'
            : row.signingConditions
              ? 'Ya'
              : 'Tidak'
        }
      </TextStyle>
    ),
    sx: { minWidth: '15vw' },
  },
  {
    key: 'effectiveConditions',
    label: 'Syarat Efektif',
    render: (row) => (
      <TextStyle>
        {
          row.effectiveConditions === '-' || row.effectiveConditions === null
            ? '-'
            : row.effectiveConditions
              ? 'Ya'
              : 'Tidak'
        }
      </TextStyle>
    ),
    sx: { minWidth: '15vw' },
  },
  {
    key: 'pkNumber',
    label: 'No PK/No Adendum',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'pkDate',
    label: 'Tanggal tanda tangan PK/Adendum',
    sx: { minWidth: '14vw' },
    type: 'date',
  },
  {
    key: 'effectiveDate',
    label: 'Tanggal Efektif',
    sx: { minWidth: '14vw' },
    type: 'date',
  },
  {
    key: 'statusLabel',
    label: 'Status',
    sx: { minWidth: '14vw' },
    type: 'status',
  }
];
