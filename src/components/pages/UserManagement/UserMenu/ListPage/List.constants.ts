import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'userId',
    label: 'User ID',
  },
  {
    key: 'name',
    label: 'Nama',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'userStatus',
    label: 'User Status',
  },
  {
    key: 'lastLoginDate',
    label: 'Last Login Date',
  },
];

export const modal = {
  APPROVAL_MODAL: 'APPROVAL_MODAL',
};
