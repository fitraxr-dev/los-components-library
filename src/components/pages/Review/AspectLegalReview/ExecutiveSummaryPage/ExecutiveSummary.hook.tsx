import { useContext, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { AspectLegalReviewContext } from '@/components/layouts/AspectLegalReviewLayout/AspectLegalReview.context';

import { useLegalAspectAccess } from '../hooks/useLegalAspectAccess';

import useExecutiveSummaryDetail from './hooks/useExecutiveSummaryDetail';
import useExecutiveSummarySave from './hooks/useExecutiveSummarySave';


export const useExecutiveSummary = () => {
  const { processId } = useIdentity();
  const [container, setContainer] = useState(null);
  const { goToNextStep } = useContext(AspectLegalReviewContext);
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();
  const { setDirtyMsg } = useContext(DirtyContext);

  const {
    data: executiveDetail,
  } = useExecutiveSummaryDetail({
    bucketProcessId: String(processId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DH,
  });

  const { mutate: mutateSave, isPending: isLoading } = useExecutiveSummarySave({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' }),
    onSuccess: () => {
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['executive-summary-detail', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      showNiceModalV2({ type: 'success' });
    },
  });

  const {
    hasAnyUpdateAccess: canUpdate,
  } = useLegalAspectAccess();

  const handleSave = async (options?: { goToNext?: boolean }) => {
    const { goToNext = false } = options || {};

    const desc = await convertToDocx(container);

    mutateSave({
      bucketProcessId: processId,
      description: desc,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
    }, {
      onSuccess: () => {
        if (goToNext) {
          goToNextStep();
        }
      },
    });
  };
  const handleSaveOnly = () => handleSave({ goToNext: false });
  const handleSaveAndNext = () => handleSave({ goToNext: true });

  const handleNext = () => goToNextStep();

  const autoSavePayload = useMemo(() => async () => {

    const desc = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description: desc,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
    };
  }, [container, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: canUpdate && !viewOnly && !!processId,
    payload: autoSavePayload,
    url: 'mip.exce.save',
  });

  return {
    canUpdate,
    container,
    executiveDetail,
    handleNext,
    handleSaveAndNext,
    handleSaveOnly,
    isAutoSaveFetching,
    isLoading,
    setContainer,
    viewOnly,
  };
};
