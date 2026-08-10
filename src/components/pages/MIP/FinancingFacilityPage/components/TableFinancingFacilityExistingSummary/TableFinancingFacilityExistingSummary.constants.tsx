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
    key: 'callType',
    label: 'CL/NCL',
    sx: {
      minWidth: '6vw',
    },
  },
  {
    key: 'totalPlafond',
    label: 'Total Plafond',
    render: (row) => (
      <TextStyle variant="body4">
        {row?.totalPlafond?.idr === '-' ? '-' : `IDR ${row?.totalPlafond?.idr ?? '-'}`}
      </TextStyle>
    ),
    sx: {
      minWidth: '6vw',
    },
  },
  {
    key: 'totalOS',
    label: 'Total OS',
    render: (row) => (
      <TextStyle variant="body4">
        {row?.totalOS?.idr === '-' ? '-' : `IDR ${row?.totalOS?.idr ?? '-'}`}
      </TextStyle>
    ),
    sx: {
      minWidth: '6vw',
    },
  },
];
