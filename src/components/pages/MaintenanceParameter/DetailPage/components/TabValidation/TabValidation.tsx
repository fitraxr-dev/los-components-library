'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import TableValidation from '@/components/shared/SmiTable/TableValidation';

import { useNavigationContext } from '../../../context/NavigationContext';


const TabValidation = () => {
  const { navigationData } = useNavigationContext();

  return (
    <TableValidation
      id={navigationData.bucketProcessId}
      module={TypeModule.PARAMETER_LOV}
      process={TypeProcess.PARAMETER_LOV}
    />
  );
};

export default TabValidation;
