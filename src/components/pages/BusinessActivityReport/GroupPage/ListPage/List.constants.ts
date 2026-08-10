import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_LIST_PAGE: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'id',
    label: 'ID Group',
  },
  {
    key: 'name',
    label: 'Nama Group',
  },

  {
    key: 'sectorLabel',
    label: 'Sektor Industri',
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

export const modal = {
  NEW_GROUP: 'NEW_GROUP',
};
