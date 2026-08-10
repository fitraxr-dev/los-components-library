import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tab = {
  FULLFILLMENT: 'Pemenuhan Persyaratan Pinjaman',
  INDICATOR: 'Indikator Keuangan dan Ekonomi',
};

export const TAB_ITEMS = [
  {
    isMandatory: true,
    label: 'Pemenuhan Persyaratan Pinjaman',
    value: tab.FULLFILLMENT,
  },
  { label: 'Indikator Keuangan dan Ekonomi', value: tab.INDICATOR },
];

export const tableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'term',
    label: 'Persyaratan',
    sx: {
      maxWidth: '32vw',
      paddingRight: '8vw !important',
    },
  },
];
