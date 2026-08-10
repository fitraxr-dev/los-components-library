'use client';
import { useContext, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetAdditionalInformationById from './hooks/useGetAdditionalInformationById';
import useSaveAdditionalInformation from './hooks/useSaveAdditionalInformation';


const useAdditionalInformation = () => {
  const { processId } = useIdentity();
  const [container, setContainer] = useState(null);
  const { viewOnly } = useViewOnly();
  const { setDirtyMsg } = useContext(DirtyContext);
  const goToNextStep = useGoToNextStep();
  const queryClient = useQueryClient();

  const {
    data: additionalInformationDetail,
    isFetching: isFetchLoading,
  } = useGetAdditionalInformationById({
    bucketProcessId: String(processId),
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.ENGAGEMENT_AGREEMENT,
  });

  const { isPending: isSaveLoading, mutate: saveAdditionalInformation } = useSaveAdditionalInformation({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['pk-additional-information', { bucketProcessId: processId }]});
      // Reset dirty state
      setDirtyMsg(undefined);
      // Show modal
      showNiceModalV2({ title: 'Additional information berhasil disimpan', type: 'success' });
    },
  });

  const handleSave = (blob: Blob) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      saveAdditionalInformation({
        bucketProcessId: String(processId),
        description: blob,
        module: TypeModule.ENGAGEMENT_AGREEMENT,
        process: TypeProcess.ENGAGEMENT_AGREEMENT,
      });
    }
  };

  const autoSavePayload = useMemo(() => async () => {
    if (!container) return null;

    const blob = await convertToDocx(container);

    return {
      bucketProcessId: String(processId),
      description: blob,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.ENGAGEMENT_AGREEMENT,
    };
  }, [container, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'agreement.additional.saveBisnis',
  });

  return {
    additionalInformationDetail,
    container,
    goToNextStep,
    handleSave,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    setContainer,
    viewOnly,
  };
};

export default useAdditionalInformation;
