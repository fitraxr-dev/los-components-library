import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDetailProjectStrategicValue from './hooks/useGetDetailProjectStrategicValue';
import useSaveProjectStrategicValue from './hooks/useSaveProjectStrategicValue';


export const useProjectStrategicValue = () => {
  const [container, setContainer] = useState(null);
  const goToNextStep = useGoToNextStep();
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const queryClient = useQueryClient();

  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();

  const { data: financingDetail } = useGetDetailProjectStrategicValue({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const { mutate: saveFinancingSummary, isPending: isSubmitting } = useSaveProjectStrategicValue({
    onSuccess: () => {
      showNiceModalV2({ onClose: () => shouldGoNext ? goToNextStep() : null, type: 'success' });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
          bucketProcessId: processId,
          module: TypeModule.MUP,
          process: TypeProcess.MUP,
        }]});
      }, 1000);
    },
  });

  const handleSave = (blob: Blob) => {
    if (!viewOnly) {
      saveFinancingSummary({
        bucketProcessId: processId,
        description: blob,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      });
    } else {
      goToNextStep();
    }
  };

  return {
    container,
    financingDetail,
    handleSave,
    isSubmitting,
    setContainer,
    setShouldGoNext,
    viewOnly,
  };
};
