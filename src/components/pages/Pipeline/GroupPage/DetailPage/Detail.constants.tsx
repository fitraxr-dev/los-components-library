import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  FORM_MEMBER_GROUP: 'FORM_MEMBER_GROUP',
};

export const TABLE_HEADER_MEMBER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama Customer',
  },
  {
    key: 'sectorLabel',
    label: 'Sektor Industri',
  },
  {
    key: 'cif',
    label: 'CIF',
  },
  {
    key: 'gamName',
    label: 'General Account Manager',
  },
  {
    key: 'remark',
    label: 'Keterangan',
  },
];
