import type { TableHeader } from '@/components/shared/Table/Table.types';


export const HEADER_TABLE: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'bucketProcessId',
    label: 'ID Proses',
  },
  {
    key: 'cif',
    label: 'CIF',
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
  },
  {
    key: 'gamName',
    label: 'General Account Manager',
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
  },
  {
    key: 'modifiedAt',
    label: 'Last Modified',
    type: 'date',
  },
  {
    key: 'statusLabel',
    label: 'Status',
    type: 'status',
  },
];
