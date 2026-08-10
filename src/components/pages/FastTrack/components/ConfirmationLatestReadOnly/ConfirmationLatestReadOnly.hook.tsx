// useConfirmationLatestReadOnly.hook.tsx

import { useMemo } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetConfirmationHistory from './hooks/useGetConfirmationHistory';


const useConfirmationLatestReadOnly = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const [{ stepper }] = useApp();

  const isEnabled = useMemo(() => {
    let enabled = false;
    if (stepper.from === 'CC_DPOP_DOCUMENT_VERIFICATION') enabled = true;

    return enabled;
  }, [processId, viewOnly]);


  // Hanya ambil data, tidak perlu mutate/save
  const { data, isSuccess } = useGetConfirmationHistory({
    bucketProcessId: processId,
    module: TypeModule.FAST_TRACK,
    process: TypeProcess.FAST_TRACK,
  }, {
    enabled: isEnabled,
  });

  // Handler untuk menutup/menyembunyikan banner
  const handleClose = () => {
    window.location.reload();
  };


  const isShowConfirm = useMemo(() => {
    let isShow = true;
    // if (data !== null && isSuccess) isShow = true;
    return isShow;
  }, [data, isSuccess]);


  return {
    handleClose,
    isShowConfirm,
  };
};


export default useConfirmationLatestReadOnly;
