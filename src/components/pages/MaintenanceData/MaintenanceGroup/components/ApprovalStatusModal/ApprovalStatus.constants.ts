import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '25px', width: '25px' },
    type: 'index',
  },
  {
    key: 'groupCode',
    label: 'ID Group',
    sx: { minWidth: '65px', width: '65px' },
  },
  {
    key: 'groupName',
    label: 'Nama Group',
    sx: { minWidth: '95px', width: '95px' },
  },
  {
    key: 'sector',
    label: 'Sektor Industri',
    sx: { minWidth: '85px', width: '85px' },
  },
  {
    key: 'createdDate',
    label: 'Request Date',
    sx: { minWidth: '85px', width: '85px' },
    type: 'date',
  },
  {
    key: 'createdBy',
    label: 'Request By',
    sx: { minWidth: '75px', width: '75px' },
  },
];
