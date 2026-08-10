import React from 'react';

import { useFormContext } from 'react-hook-form';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useViewOnly from '@/hooks/useViewOnly';

import DebtorDetailSection from '@/components/shared/SmiSection/DebtorInformation/DebtorDetailSection';


const DebtorDetail = () => {
  const formMethods = useFormContext();

  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);

  return (
    <DebtorDetailSection
      {...formMethods}
      viewOnly={true}
      jobPositionData={jobPositionData}
    />
  );
};

export default DebtorDetail;
