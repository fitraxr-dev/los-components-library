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
    key: 'customerId',
    label: 'Customer ID',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'cif',
    label: 'CIF',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'customerName',
    label: 'Nama Customer',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'gam',
    label: 'GAM',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'requestDate',
    label: 'Request Date',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'pic',
    label: 'PIC',
    sx: {
      minWidth: '8vw',
    },
  },
];
