import React from 'react';

import { useFormContext } from 'react-hook-form';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import DebtorDetailSection from '@/components/shared/SmiSection/DebtorInformation/DebtorDetailSection';


const DebtorDetail = () => {
  const formMethods = useFormContext();
  const { viewOnly } = useViewOnly();
  const { processId, analystId } = useIdentity();

  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);
  const [processIdPrefix] = processId?.split('-') || [];
  const isAnalyst = processIdPrefix === 'MIPA';

  return (
    <DebtorDetailSection
      {...formMethods}
      viewOnly={viewOnly || isAnalyst}
      jobPositionData={jobPositionData}
    />
  );
};

export default DebtorDetail;
