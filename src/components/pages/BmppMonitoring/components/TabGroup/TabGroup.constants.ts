import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'groupCode',
    label: 'ID Group',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'groupName',
    label: 'Nama Group',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'groupType',
    label: 'Jenis Group',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'isRelatedSmi',
    label: 'Terkait SMI',
    sx: {
      minWidth: '4vw',
    },
  },
];
