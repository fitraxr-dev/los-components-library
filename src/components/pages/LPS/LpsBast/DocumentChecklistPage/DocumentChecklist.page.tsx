'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import { useLpsBastContext } from '@/components/layouts/LpsLayoutBast/LpsLayoutBast.context';

import DocumentChecklist from '../../components/DocumentChecklist';


const DocumentChecklistPage = () => {
  const { isDivisiBisnis, isSuperAdmin } = useLpsBastContext();
  const { processId, parentId } = useIdentity();
  const { setIsDocumentSelected } = useLpsBastContext();

  const isLpsbd = processId?.toUpperCase().includes('LPSBD');
  const isBastDpop = (!isSuperAdmin && !isDivisiBisnis) || (isSuperAdmin && isLpsbd);

  const process = isBastDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST;

  return (
    <DocumentChecklist
      id={isBastDpop ? parentId : processId}
      module={TypeModule.LPS}
      process={process}
      onSelectedChecked={setIsDocumentSelected}
      lpsType="bast"
    />
  );
};

export default DocumentChecklistPage;
