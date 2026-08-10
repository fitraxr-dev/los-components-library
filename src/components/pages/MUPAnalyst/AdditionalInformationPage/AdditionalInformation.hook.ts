import { useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDetailAdditionalInfo from './hooks/useGetDetailAdditionalInfo';
import useSaveAdditionalInfo from './hooks/useSaveAdditionalInfo';


export const useAdditionalInformation = () => {
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const goToNextStep = useGoToNextStep();
  const [container, setContainer] = useState(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    additional: true,
  });

  const { data: additionalInfoDetail } = useGetDetailAdditionalInfo({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const { mutate: saveAdditionalInfo, isPending: isSubmitting } = useSaveAdditionalInfo({
    onSuccess: () => {
      showNiceModalV2({ onClose: () => goToNextStep(), type: 'success' });
    },
  });

  const handleSave = async () => {
    const description = await convertToDocx(container);
    if (!viewOnly) {
      saveAdditionalInfo({
        bucketProcessId: processId,
        description: description,
        disclaimer: additionalInfoDetail.disclaimer,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      });
    } else {
      goToNextStep();
    }
  };


  return {
    additionalInfoDetail,
    container,
    handleSave,
    isSubmitting,
    isWordEditorEmpty,
    setContainer,
    setIsWordEditorEmpty,
    viewOnly,
  };
};
