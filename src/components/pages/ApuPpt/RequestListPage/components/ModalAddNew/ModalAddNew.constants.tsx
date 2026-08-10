import Button from '@/components/shared/Button';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'cif',
    label: 'CIF',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'debtorId',
    label: 'ID',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'institutionTypeLabel',
    label: 'Tipe Institusi',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      minWidth: '13vw',
    },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'gamName',
    label: 'General Account Manager',
    sx: {
      minWidth: '15vw',
    },
  },
  {
    key: 'process',
    label: 'Active in',
    render: (row) => (
      <Button
        variant="outlined"
        sx={{ px: 1, py: 0.5 }}
        textVariant="body4"
        color="primary"
        noClick
      >
        {row.processLabel || '-'}
      </Button>
    ),
    sx: { minWidth: '10vw' },
  },
];
