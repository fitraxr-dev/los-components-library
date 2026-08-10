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

import useGetFinancingAnalysisById from './hooks/useGetFinancingAnalysisById';
import useSaveFinancingAnalysis from './hooks/useSaveFinancingAnalysis';


export const useFinancingAnalysis = (container: any) => {
  const [state] = useApp();
  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();

  const [shouldGoNext, setShouldGoNext] = useState(false);

  const {
    data: financingAnalysisDetail,
    isFetching: isFetchLoading,
  } = useGetFinancingAnalysisById({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  // Save Pipeline
  const { isPending: isSaveLoading, mutate: saveFinancingAnalysis } = useSaveFinancingAnalysis({
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
      saveFinancingAnalysis({
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
    isActive: !viewOnly && !!financingAnalysisDetail && !!container,
    payload: autoSavePayload,
    url: 'mip.hr.saveFga',
  });

  return {
    financingAnalysisDetail,
    handleSave,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    setShouldGoNext,
  };
};
