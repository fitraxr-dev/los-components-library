import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'skuDetail',
    label: 'Detail SKU',
    sx: { minWidth: '50%' },
  },
  {
    key: 'skuDate',
    label: 'Tanggal SKU',
    sx: { minWidth: '50%' },
    type: 'date-only',
  }
];
