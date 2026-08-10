import { formatCurrency } from '@/helpers/formatCurrency';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'bankLabel',
    label: 'Nama Bank',
    sx: {
      minWidth: '6vw',
    },
  },
  {
    key: 'grandTotal',
    label: 'Grand Total in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {`${row?.grandTotal ? `IDR ${formatCurrency(String(row?.grandTotal))}` : '-'} `}
      </TextStyle>
    ),
    sx: {
      minWidth: '6vw',
    },
  },
  {
    key: 'percentage',
    label: 'Persentase',
    render: (row) => (
      <TextStyle variant="body4">
        {`${row?.percentage}%`}
      </TextStyle>
    ),
    sx: {
      minWidth: '6vw',
    },
  },
];
