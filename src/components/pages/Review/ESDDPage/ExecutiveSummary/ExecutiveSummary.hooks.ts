import { useContext, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useESDDContext } from '@/components/layouts/EsddLayout/Esdd.context';

import { useESDDAccess } from '../hooks/useESDDAccess';
import useGetDetailExecutiveSummary from '../hooks/useGetDetailExecutiveSummary';
import useSaveExecutiveSummary from '../hooks/useSaveExecutiveSummary';


const useExecutiveSummary = () => {
  const { processId } = useIdentity();

  const { viewOnly } = useViewOnly();
  const [container, setContainer] = useState(null);
  const { setDirtyMsg } = useContext(DirtyContext);
  const { recordActivity } = useRecordLog();

  const { goToNextStep } = useESDDContext();
  const queryClient = useQueryClient();

  const {
    hasAnyUpdateAccess,
  } = useESDDAccess();

  const canUpdateExecutiveSummary = hasAnyUpdateAccess();

  const { data } = useGetDetailExecutiveSummary({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DELST,
  });

  useEffect(() => {
    if (processId) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(data),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'view executive summary detail page',
      });
    }
  }, [data, processId, recordActivity]);

  const { isPending: isLoading, mutate: mutateSave } = useSaveExecutiveSummary({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: (responseData) => {
      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
      queryClient.invalidateQueries({
        queryKey: ['executive-summary-detail', { bucketProcessId: processId }],
      });
      queryClient.invalidateQueries({
        queryKey: ['bucket-stepper', { bucketProcessId: processId }],
      });

      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(responseData?.data?.content || {}),
        changeBefore: JSON.stringify(data || {}),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'save executive summary',
      });
    },
  });

  const handleSave = async (options?: { goToNext?: boolean }) => {
    const { goToNext = false } = options || {};

    const docs = await convertToDocx(container);

    mutateSave({
      bucketProcessId: processId,
      description: docs,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
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

    const docs = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description: docs,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
    };
  }, [container, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: canUpdateExecutiveSummary && !viewOnly && !!data && !!container,
    payload: autoSavePayload,
    url: 'mip.exce.saveSum',
  });

  return {
    canUpdateExecutiveSummary,
    container,
    data,
    goToNextStep,
    handleNext,
    handleSaveAndNext,
    handleSaveOnly,
    isAutoSaveFetching,
    isLoading,
    setContainer,
    viewOnly,
  };
};

export default useExecutiveSummary;
