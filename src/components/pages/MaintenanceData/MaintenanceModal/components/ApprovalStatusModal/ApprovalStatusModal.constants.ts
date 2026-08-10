import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
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
    key: 'changeCapital',
    label: 'Modal',
  },
  {
    key: 'capitalPositionDate',
    label: 'Tanggal Posisi Modal',
    type: 'date',
  },
  {
    key: 'createdDate',
    label: 'Request Date',
    type: 'date',
  },
  {
    key: 'createdBy',
    label: 'Request By',
  },
];

export const MODAL = {
  APPROVAL_MODAL: 'APPROVAL_MODAL',
};
