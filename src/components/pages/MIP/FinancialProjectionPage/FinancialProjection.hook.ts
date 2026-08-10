import { useContext, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';


import { MODAL } from '@/configs/constants/modalId';
import { analyst } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';


import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetFinancialProjectionById from './hooks/useGetFinancialProjectionById';
import useSaveFinancialProjection from './hooks/useSaveFinancialProjection';


export const useFinancialProjection = (container: any) => {
  const [state] = useApp();
  const { goToNextStep } = useContext(MIPContext);
  const { setDirtyMsg } = useContext(DirtyContext);
  const { processId } = useParams();
  const { viewOnly } = useViewOnly();
  const [shouldGoNext, setShouldGoNext] = useState(false);

  const {
    data: financialProjectionDetail,
    isFetching: isFetchLoading,
  } = useGetFinancialProjectionById({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveFinancialProjection } = useSaveFinancialProjection({
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
      saveFinancialProjection({
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
    isActive: !viewOnly && !!financialProjectionDetail && !!container,
    payload: autoSavePayload,
    url: 'mip.hr.saveFp',
  });

  return {
    financialProjectionDetail,
    handleSave,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    setShouldGoNext,
  };
};
