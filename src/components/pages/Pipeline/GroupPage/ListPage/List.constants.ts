import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_LIST_PAGE: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'id',
    label: 'ID Group',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'name',
    label: 'Nama Group',
    sx: {
      minWidth: '10vw',
    },
  },
  // {
  //   key: 'groupType',
  //   label: 'Jenis Group',
  //   sx: {
  //     minWidth: '10vw',
  //   },
  // },
  {
    key: 'sectorLabel',
    label: 'Sektor Industri',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const FILTER_CONTENT_LIST = [
  {
    key: 'sortList',
    label: 'Urutkan Berdasarkan',
    options: [
      {
        label: 'ID Group',
        value: 'id',
      },
      {
        label: 'Group Name',
        value: 'name',
      },
      {
        label: 'Sektor Industri',
        value: 'sector',
      },
    ],
    type: 'sort',
  },
];
