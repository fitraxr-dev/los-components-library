import { useContext, useEffect, useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGetCurrentModule from '../hooks/useGetCurrentModule';

import useGetPurposeAndBackgroundById from './hooks/useGetPurposeAndBackgroundById';
import useSavePurposeAndBackground from './hooks/useSavePurposeAndBackground';


export const usePurposeAndBackground = () => {

  const { processId } = useParams();
  const { recordActivity } = useRecordLog();
  const goToNextStep = useGoToNextStep();
  const { module, process } = useGetCurrentModule();

  const { viewOnly } = useViewOnly();
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const { setDirtyMsg } = useContext(DirtyContext);

  const path = usePathname();
  const pathArray = path.split('/');
  const processModule = pathArray[3];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: purposeAndBackgroundDetail,
    isFetching: isFetchLoading,
  } = useGetPurposeAndBackgroundById({
    bucketProcessId: processId as string,
    module,
    process,
  });

  // Record activity when purpose and background page is loaded
  useEffect(() => {
    if (purposeAndBackgroundDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId as string || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view lpa review purpose and background page',
      });
    }
  }, [purposeAndBackgroundDetail, processId, module, process, recordActivity]);

  // Save
  const { isPending: isSaveLoading, mutate: savePurposeAndBackground } = useSavePurposeAndBackground({
    onSuccess: () => {
      // Record activity for saving purpose and background
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId as string || '',
        changeAfter: JSON.stringify({
          background: 'updated',
          purpose: 'updated',
        }),
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully saved lpa review purpose and background',
      });

      setDirtyMsg(undefined);

      showNiceModalV2({ onClose: () => {
        shouldGoNext ? goToNextStep() : null;
      }, title: 'Data Berhasil Di simpan', type: 'success' });
    },
  });

  const handleSave = async (backgroundFile: any, purposeFile: any) => {
    const backgroundBlob = await convertToDocx(backgroundFile);
    const purposeBlob = await convertToDocx(purposeFile);

    if (viewOnly) {
      goToNextStep();
    } else {
      savePurposeAndBackground({
        background: backgroundBlob,
        bucketProcessId: processId as string,
        module: TypeModule.LPA,
        process: processModule === 'lpa-review' ? TypeProcess.LPA_REVIEW : TypeProcess.LPA,
        purpose: purposeBlob,
      });
    }
  };

  return {
    handleSave,
    isFetchLoading,
    isSaveLoading,
    module,
    process,
    purposeAndBackgroundDetail,
    setShouldGoNext,
    viewOnly,
  };
};
