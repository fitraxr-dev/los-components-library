import { useMemo } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useIdentity from '@/hooks/useIdentity';

import useGetConfirmationHistory from './hooks/useGetConfirmationHistory';
import useSaveConfirmationHistory from './hooks/useSaveConfirmationHistory';


const useConfirmationLatest = () => {
  const { processId } = useIdentity();

  const {
    data: stepperData,
    isSuccess: stepperSuccess,
    isLoading: stepperLoading,
  } = useGetBucketStepper({
    bucketProcessId: processId,
    module: TypeModule.ANNUAL_REVIEW,
    process: TypeProcess.ANNUAL_REVIEW_DEPI,
  }, 10000); // 10 second interval


  const isEnabled = useMemo(() => {
    if (stepperLoading || !stepperData || !stepperSuccess || !stepperData.from) {
      return false;
    }
    // As per user's logic, checks for status. Usually relevant for DEPI
    const isCorrectStatus = stepperData.from?.includes('ANNUAL_REVIEW_RATING');
    return isCorrectStatus;
  }, [stepperData, stepperSuccess, stepperLoading]);


  const { data, isSuccess } = useGetConfirmationHistory({
    bucketProcessId: processId,
    module: TypeModule.ANNUAL_REVIEW,
    process: TypeProcess.ANNUAL_REVIEW_DEPI,
  }, {
    enabled: isEnabled,
  });


  const { mutate: saveConfirm, isPending: isSaveLoading } = useSaveConfirmationHistory({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      globalThis.location.reload();
    },
  });


  const handleConfirmHistory = (selectedResponse: boolean) => {
    saveConfirm({
      id: data?.id,
      module: TypeModule.ANNUAL_REVIEW,
      process: TypeProcess.ANNUAL_REVIEW_DEPI,
      selectedResponse,
    });
  };


  const isShowConfirm = useMemo(() => {
    return isEnabled && isSuccess && (data?.hasBusinessUpdate === true || data !== null && data !== undefined);
  }, [isEnabled, data, isSuccess]);


  return {
    differencesData: data?.diffs,
    handleConfirmHistory,
    hasBusinessUpdate: data?.hasBusinessUpdate,
    isSaveLoading,
    isShowConfirm,
  };
};

export default useConfirmationLatest;
