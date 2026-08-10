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
    key: 'processId',
    label: 'Process ID',
    sx: {
      minWidth: '8vw',
    },
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
      minWidth: '8vw',
    },
  },
  {
    key: 'testingTime',
    label: 'Waktu Pengajuan',
    sx: {
      minWidth: '10vw',
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
