import { useMemo } from 'react';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetConfirmationHistory from '@/components/pages/CreditChecking/components/ConfirmationLatest/hooks/useGetConfirmationHistory';

import useSaveConfirmationHistory from './hooks/useSaveConfirmationHistory';

import type { TypeModule, TypeProcess } from '@/enums/Module';


interface UseConfirmationLatestProps {
  module: TypeModule;
  process: TypeProcess;
}

const useConfirmationLatest = (props: UseConfirmationLatestProps) => {
  const { module, process } = props;
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();

  const isEnabled = useMemo(() => {
    let enabled = false;
    const bucketId = processId?.split('-')[0];
    const isDH = bucketId === 'DH';
    const isDK = bucketId === 'DK';
    const isDEPI = bucketId === 'DEPI';
    const isEsdd = bucketId === 'DELST';
    if ((isDH || isDK || isDEPI || isEsdd) && !viewOnly) enabled = true;

    return enabled;
  }, [processId, viewOnly]);


  const { data, isSuccess } = useGetConfirmationHistory({
    bucketProcessId: processId,
    module: module,
    process: process,
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
      console.log('success');
      window.location.reload();
    },
  });

  const handleConfirmHistory = (selectedResponse: boolean) => {
    saveConfirm({
      id: data?.id,
      module: module,
      process: process,
      selectedResponse,
    });
  };

  const isShowConfirm = useMemo(() => {
    let isShow = false;
    if ((data !== null || data?.hasBusinessUpdate === true) && isSuccess) isShow = true;
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
