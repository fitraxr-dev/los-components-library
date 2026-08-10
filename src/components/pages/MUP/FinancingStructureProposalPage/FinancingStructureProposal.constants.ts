import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      width: '4vw',
    },
    type: 'index',
  },
  {
    key: 'title',
    label: 'Title',
  },
];
