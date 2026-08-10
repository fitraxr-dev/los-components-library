import { useMemo } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetConfirmation from './hooks/useGetConfirmation';
import useSaveConfirmation from './hooks/useSaveConfirmation';


const useConfirmationLatest = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();

  // Get stepper data to check current status first
  // Use 10 second interval to detect status changes from ASK_FOR_INFO to other statuses
  const { data: stepperData, isSuccess: stepperSuccess, isLoading: stepperLoading } = useGetBucketStepper({
    bucketProcessId: processId,
    module: TypeModule.LPA,
    process: TypeProcess.LPA_REVIEW,
  }, 10000);

  const isEnabled = useMemo(() => {
    // Don't enable while stepper is loading or if data not yet available
    // CRITICAL: Also check if stepperData.from exists to prevent undefined !== 'ASK_FOR_INFO' = true
    if (stepperLoading || !stepperData || !stepperSuccess || !stepperData.from) {
      return false;
    }

    const bucketId = processId?.split('-')[0];
    const isLPAR = bucketId === 'LPAR';
    const isNotAskForInfo = stepperData.from !== 'ASK_FOR_INFO';

    const shouldEnable = isLPAR && !viewOnly && isNotAskForInfo;

    // Enable only if LPAR, not viewOnly, and status is not ASK_FOR_INFO
    return shouldEnable;
  }, [processId, viewOnly, stepperData, stepperSuccess, stepperLoading]);


  // Only call difference API after stepper is loaded and checked
  const { data, isSuccess } = useGetConfirmation({
    bucketProcessId: processId,
    module: TypeModule.LPA,
    process: TypeProcess.LPA_REVIEW,
  }, {
    enabled: isEnabled,
  });


  const { mutate: saveConfirm, isPending: isSaveLoading } = useSaveConfirmation({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan dicoba lagi',
        type: 'error',
      });

    },
    onSuccess: () => {
      window.location.reload();
    },
  });


  const handleConfirm = (selectedResponse: boolean) => {
    saveConfirm({
      bucketProcessId: processId,
      module: TypeModule.LPA,
      process: TypeProcess.LPA_REVIEW,
      update: selectedResponse,
    });
  };


  const isShowConfirm = useMemo(() => {
    let isShow = false;
    if (data?.hasBusinessUpdate === true && isSuccess) isShow = true;
    return isShow;
  }, [data, isSuccess]);


  return {
    differencesData: data?.diffs,
    handleConfirm,
    hasBusinessUpdate: data?.hasBusinessUpdate,
    isSaveLoading,
    isShowConfirm,
    // previousData: data?.dpop,
  };
};


export default useConfirmationLatest;
