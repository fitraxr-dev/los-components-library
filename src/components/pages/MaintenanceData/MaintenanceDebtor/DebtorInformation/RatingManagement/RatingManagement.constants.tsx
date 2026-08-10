import { formatDateTime } from '@/helpers/date';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const MockTableData = [
  {
    division: 'Division',
    grade: 'Grade',
    memoNumber: 'Memo Number',
    picName: 'Name PIC',
    ratingAnalyst: 'Rating Analyst',
    ratingMemoDate: 'Rating Memo Date',
    ratingPeriod: 'Rating Period',
    ratingResult: 'Rating Result',
    ratingType: 'Rating Type',
  }
];

export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'picName',
    label: 'Nama PIC RM',

  },
  {
    key: 'division',
    label: 'Divisi',

  },
  {
    key: 'ratingType',
    label: 'Rating Type',

  },
  {
    key: 'ratingAnalyst',
    label: 'Rating Analyst',
  },
  {
    key: 'memoNumber',
    label: 'Nomor Memo',
  },
  {
    key: 'ratingMemoDate',
    label: 'Tanggal Rating Memo',
    render: (value: string) => {
      console.log('value', value);
      return <TextStyle>{value?.ratingMemoDate ? formatDateTime(value?.ratingMemoDate) : '-'}</TextStyle>;
    },

  },
  {
    key: 'ratingPeriod',
    label: 'Rating Period',

  },
  {
    key: 'ratingResult',
    label: 'Rating Result',
    sx: {
      minWidth: '6vw',
    },
  },
  {
    key: 'grade',
    label: 'Grade',
    sx: {
      minWidth: '6vw',
    },
  },
];

export const MODAL_ID = {
  HISTORY_MODAL: 'HISTORY_MODAL',
};
