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
  {
    key: 'groupType',
    label: 'Jenis Group',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'isRelatedSmi',
    label: 'Terkait Dengan SMI',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'sector',
    label: 'Sektor Industri',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
    sx: {
      minWidth: '15vw',
    },
  },
];

export const mockTableData = [
  {
    id: 'MG-112233',
    lastModified: '01-03-2025',
    modifiedBy: 'User',
    name: 'Group Name',
    sector: 'Sector',
    yearFounded: '2019',
  }
];

export const sortDropdownList = [
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
];

export const modal = {
  APPROVAL_STATUS_MODAL: 'APPROVAL_STATUS_MODAL',
  CREATE_NEW_GROUP: 'CREATE_NEW_GROUP',
};
