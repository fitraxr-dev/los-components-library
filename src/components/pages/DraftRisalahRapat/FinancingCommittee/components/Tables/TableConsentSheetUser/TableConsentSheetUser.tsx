import * as React from 'react';

import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';

import useViewOnly from '@/hooks/useViewOnly';

import DndTable from '@/components/shared/DndTable';
import { DndTableProvider } from '@/components/shared/DndTable/DndTable';
import TableFooter from '@/components/shared/TableFooter';

import useTableConsentSheetUser from './TableConsentSheetUser.hook';

import type { TableProps } from '@/components/shared/DndTable/DndTable.types';


type TableConsentSheetDivisionProps = Omit<TableProps, 'footer' | 'tableHeader' | 'tableId'> & { sectionId: string };

const TableConsentSheetUser = ({ sectionId, ...props }: TableConsentSheetDivisionProps) => {
  const { viewOnly } = useViewOnly();

  const {
    handleAddUser,
    handleOnDragEnd,
    tableHeader,
  } = useTableConsentSheetUser(sectionId);

  return (
    <DndTableProvider
      onDragEnd={viewOnly ? undefined : handleOnDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <DndTable
        {...props}
        tableId={`consent-user-${sectionId}-table`}
        tableHeader={tableHeader}
        footer={!viewOnly && <TableFooter onClick={handleAddUser} />}
      />
    </DndTableProvider>
  );
};

export default TableConsentSheetUser;
