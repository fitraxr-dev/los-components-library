'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';


const RefinaDocumentPage = () => {
  const { processId } = useIdentity();
  const isDebt = processId?.includes('DEBT');
  return (
    <>
      <TableRefinaDocument
        module={TypeModule.MAINTENANCE_DATA}
        process={TypeProcess.MAINTENANCE_CUSTOMER}
        useDataMaster={isDebt}
      />
      <ActionFooterDetail />
    </>
  );
};

export default RefinaDocumentPage;
