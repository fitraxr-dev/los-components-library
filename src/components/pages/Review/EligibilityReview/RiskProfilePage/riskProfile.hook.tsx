import { useContext, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


import { useEligibilityReviewContext } from '@/components/layouts/EligibilityReviewLayout/EligibilityReview.context';

import { useEligibilityReviewAccess } from '../hooks/useEligibilityReviewAccess';

import useGetRiskProfileDetail from './hooks/useGetRiskProfileDetail';
import useRiskProfileSave from './hooks/useRiskProfileSave';


export const useRiskProfile = () => {
  const { viewOnly } = useViewOnly();
  const { goToNextStep } = useEligibilityReviewContext();
  const { processId } = useIdentity();
  const queryClient = useQueryClient();
  const [container, setContainer] = useState(null);
  const { setDirtyMsg } = useContext(DirtyContext);
  const id = Number(processId?.split('-')[1]);

  const { data: riskDetail, isLoading } = useGetRiskProfileDetail(
    {
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
    },
  );
  const {
    hasAnyUpdateAccess: canUpdate,
  } = useEligibilityReviewAccess();

  const { mutate: saveRiskProfile, isPending: isSaveLoading } = useRiskProfileSave({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan coba lagi.', type: 'error' });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['identify-risk-depi-detail']});
      showNiceModalV2({ title: 'Data berhasil di simpan.', type: 'success' });

    },
  });

  const handleSave = async (fileDescription: any, options?: { goToNext?: boolean }) => {
    const { goToNext = false } = options || {};

    if (viewOnly) return goToNextStep();

    const fileDesc = await convertToDocx(fileDescription);
    let payload = {
      bucketProcessId: processId,
      description: fileDesc,
      id,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
    };

    saveRiskProfile(payload, {
      onSuccess: () => {
        if (goToNext) {
          goToNextStep();
        }
      },
    });
  };
  const handleSaveOnly = () => handleSave(container, { goToNext: false });
  const handleSaveAndNext = () => handleSave(container, { goToNext: true });

  const handleNext = () => goToNextStep();

  const isLoadingState = isLoading || isSaveLoading;

  const autoSavePayload = useMemo(() => async () => {

    const fileDesc = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description: fileDesc,
      id,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
    };
  }, [container, processId, id]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: canUpdate && !viewOnly && !!riskDetail && !!processId,
    payload: autoSavePayload,
    url: 'mip.riskProfile.save',
  });

  return {
    canUpdate,
    container,
    handleNext,
    handleSaveAndNext,
    handleSaveOnly,
    isAutoSaveFetching,
    isLoading: isLoadingState,
    riskDetail,
    setContainer,
    viewOnly,
  };
};
