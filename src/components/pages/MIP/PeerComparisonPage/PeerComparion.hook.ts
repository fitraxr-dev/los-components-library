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

import useGetPeerComparisonById from './hooks/useGetPeerComparisonById';
import useSavePeerComparison from './hooks/useSavePeerComparison';


export const usePeerComparison = (container: any) => {
  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [state] = useApp();
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();

  const [shouldGoNext, setShouldGoNext] = useState(false);

  const {
    data: peerComparisonDetail,
    isFetching: isFetchLoading,
  } = useGetPeerComparisonById({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  // Save
  const { isPending: isSaveLoading, mutate: savePeerComparison } = useSavePeerComparison({
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
      savePeerComparison({
        bucketProcessId: processId as string,
        description: blob,
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
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    };
  }, [container, processId, state.pages.mipModule, state.pages.mipProcess]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!peerComparisonDetail && !!container,
    payload: autoSavePayload,
    url: 'mip.hr.savePeer',
  });

  return {
    handleSave,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    peerComparisonDetail,
    setShouldGoNext,
  };
};
