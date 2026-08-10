import type { TableHeader } from '@/components/shared/Table/Table.types';


export const HEADER_TABLE: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'idLov',
    label: 'LOV ID',
  },
  {
    key: 'description',
    label: 'Deskripsi',
  },
  {
    key: 'ariumCode',
    label: 'ARIUM CODE',
  },
  {
    key: 'temenosCode',
    label: 'TEMENOS CODE',
  },
  {
    key: 'active',
    label: 'Active',
  },
];

export const modal = {
  ADD_REQUEST_FORM: 'ADD_REQUEST_FORM',
  DETAIL_MODAL: 'DETAIL_MODAL',
};
