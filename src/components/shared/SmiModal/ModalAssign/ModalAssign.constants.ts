import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderSelectedTask: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      width: '2vw',
    },
    type: 'index',
  },
  {
    key: 'id',
    label: 'ID',
    sx: {
      width: '10vw',
    },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      width: '10vw',
    },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: {
      width: '10vw',

    },
  },
  {
    key: 'staffDivisionLabel',
    label: 'Divisi',
    sx: {
      width: '15vw',
    },
  }
];
