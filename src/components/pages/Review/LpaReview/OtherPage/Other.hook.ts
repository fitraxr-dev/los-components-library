import { useContext, useEffect, useState } from 'react';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGetCurrentModule from '../hooks/useGetCurrentModule';

import useGetOthers from './hooks/useGetOthersData';
import useSaveOthers from './hooks/useSaveOthers';


const useOthersHooks = () => {
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const goToNextStep = useGoToNextStep();
  const [container, setContainer] = useState(null);
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const { setDirtyMsg } = useContext(DirtyContext);

  const { module, process } = useGetCurrentModule();

  const { data, isLoading } = useGetOthers({
    bucketProcessId: processId,
    module,
    process,
  });

  // Record activity when other page data is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view lpa review other page',
      });
    }
  }, [data, processId, module, process, recordActivity]);

  const { mutate, isPending } = useSaveOthers({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for saving other data
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          description: 'updated',
        }),
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully saved lpa review other data',
      });

      setDirtyMsg(undefined);

      showNiceModalV2({
        onClose: () => {
          if (shouldGoNext) {
            setTimeout(() => {
              goToNextStep();
            }, 100);
          }
        },
        title: 'Data Berhasil Di simpan',
        type: 'success',
      });
    },
  });

  const handleSaveOthers = async (description: any) => {
    const document = await convertToDocx(description);

    if (viewOnly) {
      goToNextStep();
    } else {
      mutate({
        bucketProcessId: processId,
        description: document,
        module,
        process,
      });
    }
  };

  return {
    container,
    data,
    handleSaveOthers,
    isLoading,
    isPending,
    module,
    mutate,
    process,
    setContainer,
    setShouldGoNext,
    viewOnly,
  };
};

export default useOthersHooks;
