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
    key: 'bucketProcessId',
    label: 'ID Process',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'accessMenuName',
    label: 'Access Menu Name',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'modifiedDate',
    label: 'Modified Date',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'reason',
    label: 'Reason',
    sx: {
      minWidth: '8vw',
    },
  },
];

export const data = {
  contents: [
    {
      'EMAIL': 'john@example.com',
      'NAME': 'John Doe',
      'STATUS': 'Waiting Approval TL',
      'USER_ID': 42876,
    },
    {
      'EMAIL': 'jane@example.com',
      'LAST_LOGIN_DATE': '2024-05-10',
      'NAME': 'Jane Smith',
      'STATUS': 'Waiting Approval Kadiv',
      'USER_ID': 98321,
    },
    {
      'EMAIL': 'alice@example.com',
      'LAST_LOGIN_DATE': '2024-05-14',
      'NAME': 'Alice Johnson',
      'STATUS': 'Return to staff',
      'USER_ID': 57432,
    },

  ],
  page: {
    totalPage: 1,
  },
};
