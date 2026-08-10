import type { TableHeader } from '@/components/shared/Table/Table.types';


export const mockTableData = [
  {
    aging: '[aging]',
    covenant: '[covenant]',
    dueDate: '[due date]',
    fileName: '[fileName]',
    inTermsOf: '[in terms of]',
    uploadBy: '[upload by]',
    uploadDate: '[upload date]',
  }
];

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
    key: 'fileName',
    label: 'Nama File',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'covenant',
    label: 'Covenant/Non Covenant',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'inTermsOf',
    label: 'Perihal',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'uploadBy',
    label: 'Upload By',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'uploadDate',
    label: 'Upload Date',
    sx: {
      minWidth: '10vw',
    },
  },
];
