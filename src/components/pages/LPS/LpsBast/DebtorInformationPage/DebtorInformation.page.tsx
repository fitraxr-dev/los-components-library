'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import { useLpsBastContext } from '@/components/layouts/LpsLayoutBast/LpsLayoutBast.context';

import DebtorInformation from '../../components/DebtorInformation';


const DebtorInformationPage = () => {
  const { isDivisiBisnis, isSuperAdmin } = useLpsBastContext();
  const { processId } = useIdentity();
  const isProcessDpop = String(processId).includes('LPSBD');

  return (
    <DebtorInformation
      module={TypeModule.LPS}
      process={(isProcessDpop || !(isDivisiBisnis || isSuperAdmin)) ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST}
    />
  );
};

export default DebtorInformationPage;
