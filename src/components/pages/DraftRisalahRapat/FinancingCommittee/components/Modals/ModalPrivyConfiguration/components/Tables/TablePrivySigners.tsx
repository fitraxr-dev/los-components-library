import * as React from 'react';

import DndTable from '@/components/shared/DndTable';

import { TABLE_HEADER } from './TablePrivySigners.constants';

import type { TableProps } from '@/components/shared/DndTable/DndTable.types';


type TablePrivySignersProps = Omit<TableProps, 'tableHeader' | 'tableId'>;

const TablePrivySigners = (props: TablePrivySignersProps) => {

  return (
    <DndTable
      {...props}
      tableId="privy-signers-table"
      tableHeader={TABLE_HEADER}
    />
  );
};

export default TablePrivySigners;
