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
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'email',
    label: 'Email',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'status',
    label: 'Status User',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'modifiedBy',
    label: 'Modify By',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'modifiedApprovedDate',
    label: 'Modify Approved Date',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'lastLoginDate',
    label: 'Last Login Date',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const modal = {
  APPROVAL_MODAL: 'APPROVAL_MODAL',
};
