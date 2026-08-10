import PICRenderer from '@/components/shared/SmiSection/PICRenderer';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderResultList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'id',
    label: 'ID',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'rmName',
    label: 'Nama RM',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'pic',
    label: 'PIC',
    render: (row) => <PICRenderer data={row?.pic} />,
    sx: { minWidth: '10vw' },
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    sx: { minWidth: '10vw' },
    type: 'date',
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    sx: { minWidth: '10vw' },
  },
];
