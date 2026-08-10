import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'idProcess',
    label: 'ID Process',
  },
  {
    key: 'tipeProcess',
    label: 'Tipe Process',
  },
  {
    key: 'date',
    label: 'Date',
    type: 'date',
  },
];
