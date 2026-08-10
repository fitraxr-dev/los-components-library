import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_LIST: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'bucketProcessId',
    label: 'ID',
  },
  {
    key: 'commitment',
    label: 'Komitmen',
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    type: 'date',
  },
  {
    key: 'processLabel',
    label: 'Process',
    type: 'status',
  },
  {
    key: 'statusLabel',
    label: 'Status',
    type: 'status',
  },
];
