import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeader: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'debtor',
    label: 'Customer / Project',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'pic',
    label: 'Nama PIC RM',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'ratingType',
    label: 'Rating Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'ratingAnalyst',
    label: 'Rating Analyst',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'memoNumber',
    label: 'Nomor Memo',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'memoDate',
    label: 'Tanggal Rating Memo',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'ratingPeriod',
    label: 'Rating Periode',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'ratingResult',
    label: 'Rating Result',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const tableData = [
  {
    debtor: 'Customer 1',
    memoDate: 'Memo Date 1',
    memoNumber: 'Memo Number 1',
    pic: 'PIC 1',
    ratingAnalyst: 'Rating Analyst 1',
    ratingPeriod: 'Rating Period 1',
    ratingResult: 'Rating Result 1',
    ratingType: 'Rating Type 1',
  },
  {
    debtor: 'Customer 2',
    memoDate: 'Memo Date 2',
    memoNumber: 'Memo Number 2',
    pic: 'PIC 2',
    ratingAnalyst: 'Rating Analyst 2',
    ratingPeriod: 'Rating Period 2',
    ratingResult: 'Rating Result 2',
    ratingType: 'Rating Type 2',
  },
  {
    debtor: 'Customer 3',
    memoDate: 'Memo Date 3',
    memoNumber: 'Memo Number 3',
    pic: 'PIC 3',
    ratingAnalyst: 'Rating Analyst 3',
    ratingPeriod: 'Rating Period 3',
    ratingResult: 'Rating Result 3',
    ratingType: 'Rating Type 3',
  }
];
