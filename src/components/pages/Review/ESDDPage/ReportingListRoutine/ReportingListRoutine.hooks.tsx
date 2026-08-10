import useViewOnly from '@/hooks/useViewOnly';

import { useESDDContext } from '@/components/layouts/EsddLayout/Esdd.context';


const useReportingListRoutine = () => {
  const { goToNextStep } = useESDDContext();
  const { viewOnly } = useViewOnly();

  return {
    goToNextStep,
    viewOnly,
  };
};

export default useReportingListRoutine;
