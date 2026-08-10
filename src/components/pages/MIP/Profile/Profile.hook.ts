import { useContext, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useViewOnly from '@/hooks/useViewOnly';


import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetProfileById from './hooks/useGetProfileById';
import useSaveProfile from './hooks/useSaveProfile';


export const useProfile = (container: any) => {
  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();
  const [state] = useApp();

  const [shouldGoNext, setShouldGoNext] = useState(false);

  const {
    data: profileDetail,
    isFetching: isFetchLoading,
  } = useGetProfileById({
    bucketProcessId: processId as string,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveProfile } = useSaveProfile({
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({ onClose: () => shouldGoNext ? goToNextStep() : null, type: 'success' });
    },
  });

  const handleSave = (blob: Blob) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      saveProfile({
        bucketProcessId: processId as string,
        description: blob,
        id: undefined,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      });
    }
  };

  const autoSavePayload = useMemo(() => async () => {

    const blob = await convertToDocx(container);

    return {
      bucketProcessId: processId as string,
      description: blob,
      id: undefined,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    };
  }, [container, processId, state.pages.mipModule, state.pages.mipProcess]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!profileDetail && !!container,
    payload: autoSavePayload,
    url: 'mip.hr.saveProfile',
  });

  return {
    handleSave,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    profileDetail,
    setShouldGoNext,
  };
};
