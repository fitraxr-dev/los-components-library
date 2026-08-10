import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'role',
    label: 'Role',
    sx: { minWidth: '28%' },
  },
  {
    key: 'deadline',
    label: 'SLA Deadline',
    sx: { minWidth: '28%' },
  },
  {
    key: 'isActive',
    label: 'Active',
    sx: { minWidth: '28%' },
  },
];
