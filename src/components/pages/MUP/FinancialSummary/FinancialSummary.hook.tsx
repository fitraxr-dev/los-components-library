import { useState } from 'react';

import { roles } from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';

import useGetDetailFinancialSummary from './hooks/useGetDetailFinancialSummary';
import useSaveFinancialSummary from './hooks/useSaveFinancialSummary';


export const useFinancialSummary = () => {
  const [container, setContainer] = useState(null);
  const goToNextStep = useGoToNextStep();
  const [shouldGoNext, setShouldGoNext] = useState(false);

  const { processId } = useIdentity();
  const [{ currentRole }] = useApp();

  const isAnalyst = currentRole.includes(roles.ANALYST);

  const { data: financingDetail } = useGetDetailFinancialSummary({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const { mutate: saveFinancingSummary, isPending: isSubmitting } = useSaveFinancialSummary({
    onSuccess: () => {
      showNiceModalV2({ onClose: () => shouldGoNext ? goToNextStep() : null, type: 'success' });
    },
  });

  const handleSave = (blob: Blob) => {
    if (isAnalyst) {
      saveFinancingSummary({
        bucketProcessId: processId,
        description: blob,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      });
    }
  };

  return {
    container,
    financingDetail,
    handleSave,
    isSubmitting,
    setContainer,
    setShouldGoNext,
  };
};
