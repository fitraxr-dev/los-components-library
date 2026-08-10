import { formatCurrency } from '@/helpers/formatCurrency';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


export const TABLE_HEADER_BANK_INFORMATION: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'bankName',
    label: 'Bank / Lembaga Keuangan',
  },
  {
    key: 'amount',
    label: 'Amount',
    render(row) {
      return <TextStyle>{formatCurrency(String(row?.amount), { maxLength: 35 })}</TextStyle>;
    },
  },
];
