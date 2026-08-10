import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_RISK_PROFILE_HEADER: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      width: '55px',
    },
    type: 'index',
  },
  {
    key: 'riskTypeLabel',
    label: 'Jenis Risiko',
    sx: {
      maxWidth: '180px',
    },
  },
];
