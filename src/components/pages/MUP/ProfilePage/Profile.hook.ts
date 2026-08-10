import { useContext, useState } from 'react';

import { useParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useViewOnly from '@/hooks/useViewOnly';


import useGetProfileById from './hooks/useGetProfileById';
import useSaveProfile from './hooks/useSaveProfile';


export const useProfile = () => {
  const { processId } = useParams();
  const goToNextStep = useGoToNextStep();
  const { viewOnly } = useViewOnly();

  const [container, setContainer] = useState(null);
  const { setDirtyMsg } = useContext(DirtyContext);

  const {
    data: profileDetail,
    isFetching: isFetchLoading,
  } = useGetProfileById({
    bucketProcessId: processId as string,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveProfile } = useSaveProfile({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ onClose: () => goToNextStep(), type: 'success' });
    },
  });

  const handleSave = async () => {
    const description = await convertToDocx(container);
    if (viewOnly) {
      goToNextStep();
    } else {
      saveProfile({
        bucketProcessId: processId as string,
        description: description,
        id: undefined,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      });
    }
  };

  return {
    container,
    goToNextStep,
    handleSave,
    isFetchLoading,
    isSaveLoading,
    profileDetail,
    setContainer,
  };
};
