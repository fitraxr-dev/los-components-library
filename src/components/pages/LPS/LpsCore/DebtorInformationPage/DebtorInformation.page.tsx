'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import DebtorInformation from '../../components/DebtorInformation';


const DebtorInformationPage = () => {
  return (
    <DebtorInformation
      module={TypeModule.LPS}
      process={TypeProcess.LPS_CORE}
    />
  );
};

export default DebtorInformationPage;
