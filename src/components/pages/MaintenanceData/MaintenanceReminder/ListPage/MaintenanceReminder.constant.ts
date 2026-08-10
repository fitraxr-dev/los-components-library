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
    key: 'templateType',
    label: 'Reminder Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'scheduleType',
    label: 'Schedule Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'reminderSubject',
    label: 'Subject Email',
    sx: {
      minWidth: '15vw',
    },
  },
  {
    key: 'modifiedDate',
    label: 'Last Modified',
    sx: {
      minWidth: '15vw',
    },
    // type: 'date-only',
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const modal = {
  APPROVAL_STATUS_MODAL: 'APPROVAL_STATUS_MODAL',
  CREATE_NEW_GROUP: 'CREATE_NEW_GROUP',
};
