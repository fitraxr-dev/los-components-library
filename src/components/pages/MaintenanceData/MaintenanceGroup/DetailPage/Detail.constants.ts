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
    key: 'name',
    label: 'Nama Customer',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'sector',
    label: 'Sektor Industri',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'customerId',
    label: 'Customer ID',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'cif',
    label: 'CIF',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'gamName',
    label: 'Gam',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'remark',
    label: 'Keterangan',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: {
      minWidth: '8vw',
    },
  },
];

export const modal = {
  DELETE_GROUP_MODAL: 'DELETE_GROUP_MODAL',
  FORM_MEMBER_GROUP: 'FORM_MEMBER_GROUP',
  VIEW_DETAIL_GROUP_MODAL: 'VIEW_DETAIL_GROUP_MODAL',
};
