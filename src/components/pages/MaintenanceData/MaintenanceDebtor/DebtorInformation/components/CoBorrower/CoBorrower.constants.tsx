import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'cif',
    label: 'Co - Borrower CIF',
    render: ({ cif }) => {
      return <TextStyle variant="body4">{cif ?? '-'}</TextStyle>;
    },
  },
  {
    key: 'borrowerName',
    label: 'Co - Borrower Name',
    render: ({ borrowerName }) => {
      return <TextStyle variant="body4">{borrowerName ?? '-'}</TextStyle>;
    },
  },
];
