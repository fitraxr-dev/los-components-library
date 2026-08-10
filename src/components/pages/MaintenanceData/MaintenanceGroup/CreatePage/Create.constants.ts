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
    key: 'debtorId',
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
    key: 'institutionType',
    label: 'Institution Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'name',
    label: 'Nama Customer',
    sx: {
      minWidth: '8vw',
    },
  },
];

export const modal = {
  DELETE_GROUP_MODAL: 'DELETE_GROUP_MODAL',
  FORM_MEMBER_GROUP: 'FORM_MEMBER_GROUP',
  RECOMMENDED_GROUP: 'MAINTENANCE_GROUP_RECOMMENDED_GROUP',
  VIEW_DETAIL_GROUP_MODAL: 'VIEW_DETAIL_GROUP_MODAL',
};

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

export const mockTableDataBmpk = [
  {
    dataasof: '4 Maret 2025 12:30:34',
    surpass: 'Terjadi pelanggaran BMPP',
  },
  {
    dataasof: '3 Maret 2025 12:30:34',
    surpass: 'Tidak terjadi pelanggaran BMPP',
  },
  {
    dataasof: '2 Maret 2025 12:30:34',
    surpass: 'Tidak terjadi pelanggaran BMPP',
  },
];
