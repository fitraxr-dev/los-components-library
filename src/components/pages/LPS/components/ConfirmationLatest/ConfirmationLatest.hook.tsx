import { useMemo } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetConfirmationHistory from './hooks/useGetConfirmationHistory';
import useSaveConfirmationHistory from './hooks/useSaveConfirmationHistory';


const useConfirmationLatest = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();

  // Use 10 second interval to detect status changes
  const {
    data: stepperData,
    isSuccess: stepperSuccess,
    isLoading: stepperLoading,
  } = useGetBucketStepper({
    bucketProcessId: processId,
    module: TypeModule.LPS,
    process: TypeProcess.LPS_BAST_DPOP,
  }, 10000);


  const isEnabled = useMemo(() => {

    if (stepperLoading || !stepperData || !stepperSuccess || !stepperData.from) {
      return false;
    }
    const isCorrectStatus = stepperData.from?.includes('ASK_FOR_INFO');

    const shouldEnable = isCorrectStatus;


    return shouldEnable;
  }, [processId, stepperData, stepperSuccess, stepperLoading]);


  const { data, isSuccess } = useGetConfirmationHistory({
    bucketProcessId: processId,
    module: TypeModule.LPS,
    process: TypeProcess.LPS_BAST_DPOP,
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
      window.location.reload();
    },
  });


  const handleConfirmHistory = (selectedResponse: boolean) => {
    saveConfirm({
      id: data?.id,
      module: TypeModule.LPS,
      process: TypeProcess.LPS_BAST_DPOP,
      selectedResponse,
    });
  };


  const isShowConfirm = useMemo(() => {
    let isShow = false;

    if (data?.hasBusinessUpdate === true && isSuccess) {
      isShow = true;
    } else if (data !== null && isSuccess) {
      isShow = true;
    }

    return isShow;
  }, [data, isSuccess]);


  return {
    differencesData: data?.diffs,
    handleConfirmHistory,
    hasBusinessUpdate: data?.hasBusinessUpdate,
    isSaveLoading,
    isShowConfirm,
  };
};


export default useConfirmationLatest;
