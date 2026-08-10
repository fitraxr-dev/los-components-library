import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'changeCapital',
    label: 'Modal',
  },
  {
    key: 'capitalPositionDate',
    label: 'Tanggal Posisi Modal',
    type: 'date',
  },
  {
    key: 'approvedBy',
    label: 'Approved By',
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
    type: 'date',
  },
];

export const MODAL = {
  HISTORY_MODAL: 'HISTORY_MODAL',
};
