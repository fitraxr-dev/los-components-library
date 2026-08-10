import { useParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';


export const useFinancingOverview = () => {
  const goToNextStep = useGoToNextStep();

  const { processId } = useIdentity();

  return {
    goToNextStep,
    processId,
  } ;
};
