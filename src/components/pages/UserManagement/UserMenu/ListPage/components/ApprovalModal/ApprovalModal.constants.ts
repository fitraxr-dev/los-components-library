import type { TableHeader } from '@/components/shared/Table/Table.types';


export const HEADER_TABLE: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'bucketProcessId',
    label: 'User ID',
  },
  {
    key: 'fullName',
    label: 'Nama User',
  },
  {
    key: 'email',
    label: 'Email',
  },
];
