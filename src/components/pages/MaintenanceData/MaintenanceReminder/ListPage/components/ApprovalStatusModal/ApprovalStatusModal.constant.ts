import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
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
    label: 'ID Pengajuan',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'templateType',
    label: 'Reminder Type',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'reminderSubject',
    label: 'Subject Email',
    sx: { minWidth: '15vw' },
  },
  {
    key: 'createdByName',
    label: 'Staff',
    sx: { minWidth: '13vw' },
  },
  {
    key: 'createdDate',
    label: 'Tanggal Pengajuan',
    sx: { minWidth: '15vw' },
    // type: 'date-only',
  },
  {
    key: 'status',
    label: 'Status',
    sx: { minWidth: '16vw' },
    type: 'status',
  },
];
