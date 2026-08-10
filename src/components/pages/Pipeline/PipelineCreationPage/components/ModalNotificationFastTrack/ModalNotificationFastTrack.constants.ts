import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderSelectedPipeline: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      width: '2vw',
    },
    type: 'index',
  },
  {
    key: 'processId',
    label: 'ID Pipeline',
    sx: {
      width: '10vw',
    },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: {
      width: '12vw',
    },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: {
      width: '12vw',
    },
  },
  {
    key: 'staffDivisionLabel',
    label: 'Divisi',
    sx: {
      width: '12vw',
    },
  }
];
