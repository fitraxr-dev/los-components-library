import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tab = {
  PROPOSAL: 'Usulan Pembiayaan',
  STRUCTURE: 'Struktur Pembiayaan',
};

export const TAB_ITEMS = [
  { label: 'Usulan Pembiayaan', value: tab.PROPOSAL },
  { label: 'Struktur Pembiayaan', value: tab.STRUCTURE },
];

export const tableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'title',
    label: 'Title',
    sx: {
      minWidth: '20vw',
    },
  },
];
