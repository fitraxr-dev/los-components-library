import { useMemo } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetConfirmationHistory from './hooks/useGetConfirmationHistory';
import useSaveConfirmationHistory from './hooks/useSaveConfirmationHistory';


const useConfirmationLatest = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();

  const isEnabled = useMemo(() => {
    let enabled = false;
    const bucketId = processId?.split('-')[0];
    const isApdp = bucketId === 'APDP';
    if (isApdp && !viewOnly) enabled = true;

    return enabled;
  }, [processId, viewOnly]);


  const { data, isSuccess } = useGetConfirmationHistory({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: TypeProcess.APU_PPT_DPOP,
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
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT_DPOP,
      selectedResponse,
    });
  };


  const isShowConfirm = useMemo(() => {
    let isShow = false;
    if (data !== null && isSuccess) isShow = true;
    return isShow;
  }, [data, isSuccess]);


  return {
    handleConfirmHistory,
    isSaveLoading,
    isShowConfirm,
  };
};


export default useConfirmationLatest;
