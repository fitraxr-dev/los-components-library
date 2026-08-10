import { useContext, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useViewOnly from '@/hooks/useViewOnly';


import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetAdditionalInformationById from './hooks/useGetAdditionalInformationById';
import useSaveAdditionalInformation from './hooks/useSaveAdditionalInformation';


export const useAdditionalInformation = (container: any) => {
  const [state] = useApp();
  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();
  const [shouldGoNext, setShouldGoNext] = useState(false);

  const {
    data: additionalInformationDetail,
    isFetching: isFetchLoading,
  } = useGetAdditionalInformationById({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveAdditionalInformation } = useSaveAdditionalInformation({
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
      saveAdditionalInformation({
        bucketProcessId: String(processId),
        description: blob,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      });
    }
  };

  const autoSavePayload = useMemo(() => async () => {

    const blob = await convertToDocx(container);

    return {
      bucketProcessId: String(processId),
      description: blob,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    };
  }, [container, processId, state.pages.mipModule, state.pages.mipProcess]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!additionalInformationDetail && !!processId,
    payload: autoSavePayload,
    url: 'mip.additionalInformation.save',
  });

  return {
    additionalInformationDetail,
    handleSave,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    setShouldGoNext,
  };
};
