import { useContext, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useViewOnly from '@/hooks/useViewOnly';


import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetFeasibilityAspectById from './hooks/useGetFeasibilityAspectById';
import useSaveFeasibilityAspect from './hooks/useSaveFeasibilityAspect';


export const useFeasibilityAspect = (container: any) => {
  const [state] = useApp();
  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();
  const [shouldGoNext, setShouldGoNext] = useState(false);

  const {
    data: feasibilityAspectDetail,
    isFetching: isFetchLoading,
  } = useGetFeasibilityAspectById({
    bucketProcessId: processId as string,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveFeasibilityAspect } = useSaveFeasibilityAspect({
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({ type: 'success' });
      shouldGoNext ? goToNextStep() : null;
    },
  });

  const handleSave = (blob: Blob) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      saveFeasibilityAspect({
        bucketProcessId: processId as string,
        description: blob,
        id: undefined,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      });
    }
  };

  const autoSavePayload = useMemo(() => async () => {

    const blob = await convertToDocx(container);

    return {
      bucketProcessId: processId as string,
      description: blob,
      id: undefined,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    };
  }, [container, processId, state.pages.mipModule, state.pages.mipProcess]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!feasibilityAspectDetail && !!container,
    payload: autoSavePayload,
    url: 'mip.hr.saveAspect',
  });

  return {
    feasibilityAspectDetail,
    handleSave,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    setShouldGoNext,
  };
};
