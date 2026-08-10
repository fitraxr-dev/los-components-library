import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'userId',
    label: 'User ID',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'name',
    label: 'Name',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'email',
    label: 'Email',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'role',
    label: 'Role',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'position',
    label: 'Position',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'mappingDate',
    label: 'Mapping Date',
    sx: {
      minWidth: '8vw',
    },
  },
];
