import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '30%' },
    type: 'index',
  },
  {
    key: 'stage',
    label: 'Stage',
    sx: { minWidth: '30%' },
  },
  {
    key: 'isActive',
    label: 'Active',
    sx: { minWidth: '30%' },
  },
];

export const modal = {
  APPROVAL_MODAL: 'APPROVAL_MODAL',
};
