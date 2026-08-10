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
    key: 'accessMenuName',
    label: 'Access Menu Name',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'lastMaintainDate',
    label: 'Last Maintain Date',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const modal = {
  APPROVAL_MODAL: 'APPROVAL_MODAL',
};
