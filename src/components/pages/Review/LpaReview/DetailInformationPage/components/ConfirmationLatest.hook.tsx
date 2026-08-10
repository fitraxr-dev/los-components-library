import { useMemo } from 'react';

import { useParams } from 'next/navigation';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetCurrentModule from '../../hooks/useGetCurrentModule';
import useGetConfirmation from '../hooks/useGetConfirmation';
import useSaveConfirmation from '../hooks/useSaveConfirmation';


const useConfirmationLatest = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { parentId }: { parentId: string } = useParams();
  const { module, process } = useGetCurrentModule();

  const isEnabled = useMemo(() => {
    let enabled = false;
    const bucketId = processId?.split('-')[0];
    const isLPAR = bucketId === 'LPAR';
    if (isLPAR && !viewOnly) enabled = true;

    return enabled;
  }, [processId, viewOnly]);


  const { data, isSuccess } = useGetConfirmation({
    bucketProcessId: processId,
    code: parentId,
    module: String(module),
    process: String(process),
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
      code: parentId,
      isUpdate: selectedResponse,
      module: String(module),
      process: String(process),
    });
  };


  const isShowConfirm = useMemo(() => {
    let isShow = false;
    if (data?.hasBusinessUpdate === true && isSuccess) isShow = true;
    return isShow;
  }, [data, isSuccess]);

  const diffFilter = Object.fromEntries(
    Object.entries(data?.diffs || {}).filter(
      ([_, value]) => value.changed === true
    )
  );

  return {
    differencesData: diffFilter,
    handleConfirm,
    hasBusinessUpdate: data?.hasBusinessUpdate,
    isSaveLoading,
    isShowConfirm,
    previousData: data?.dpop,
  };
};


export default useConfirmationLatest;
