import type { TableHeader } from '@/components/shared/Table/Table.types';


export const DRD_INTERFACE_TABLE: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'sentToDrdDate',
    label: 'Send To DRD',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'drdConfirmation',
    label: 'DRD Confirmation',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'informationDrd',
    label: 'Information',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'status',
    label: 'Status',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'fileName',
    label: 'Document',
    sx: { minWidth: '7.5vw' },
  },
];
