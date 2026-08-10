import { useContext, useState } from 'react';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetSpecialApprovaDescriptionById from './hooks/useGetSpecialApprovalDescriptionById';
import useSaveSpecialApprovalDescription from './hooks/useSaveSpecialApprovalDescription';


export const useSpecialApproval = () => {
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const { setDirtyMsg } = useContext(DirtyContext);
  const goToNextStep = useGoToNextStep();

  const [shouldGoNext, setShouldGoNext] = useState(false);

  const {
    data: specialApprovalDetail,
    isFetching: isFetchLoading,
  } = useGetSpecialApprovaDescriptionById({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveSpecialApprovalDescription } = useSaveSpecialApprovalDescription({
    onSuccess: () => {
    // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({ onClose: () => shouldGoNext ? goToNextStep() : null, type: 'success' });
    },
  });

  const handleSave = (blob: Blob) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      saveSpecialApprovalDescription({
        bucketProcessId: String(processId),
        description: blob,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      });
    }
  };
  return {
    handleSave,
    isFetchLoading,
    isSaveLoading,
    setShouldGoNext,
    specialApprovalDetail,
    viewOnly,
  };
};
