import type { TableHeader } from '@/components/shared/Table/Table.types';


export const HEADER_TABLE: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'USER_ID',
    label: 'User ID',
  },
  {
    key: 'NAME',
    label: 'Nama User',
  },
  {
    key: 'EMAIL',
    label: 'Email',
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
