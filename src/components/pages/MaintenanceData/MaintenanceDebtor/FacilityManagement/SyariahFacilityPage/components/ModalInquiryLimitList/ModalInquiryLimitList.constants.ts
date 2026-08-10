import type { TableHeader } from '@/components/shared/TableV2/Table.types';


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
    key: 'idLimitAnak',
    label: 'ID Limit',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'idLimitInduk',
    label: 'ID Limit Induk',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'nominalFasilitas',
    label: 'Nominal Fasilitas Limit',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'akad',
    label: 'Akad',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'revolving',
    label: 'Revolving',
    sx: {
      minWidth: '4vw',
    },
  },
  {
    key: 'idld',
    label: 'ID LD',
    sx: {
      minWidth: '4vw',
    },
  },
];
