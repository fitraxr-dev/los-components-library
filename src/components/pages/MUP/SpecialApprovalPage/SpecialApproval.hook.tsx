import { useContext, useEffect, useMemo, useState } from 'react';


import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';

import { useMUPAccess } from '../hooks/useMUPAccess';

import useGetSpecialApprovaDescriptionById from './hooks/useGetSpecialApprovalDescriptionById';
import useSaveSpecialApprovalDescription from './hooks/useSaveSpecialApprovalDescription';


export const useSpecialApproval = () => {
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const { goToNextStep } = useMUPContext();
  const [container, setContainer] = useState(null);
  const { setDirtyMsg } = useContext(DirtyContext);
  const { recordActivity } = useRecordLog();
  const { baseMUPAccess, isAnalyst } = useMUPAccess();

  const canViewSpecialApproval = baseMUPAccess.canView;
  const isViewOnlyMode = viewOnly || isAnalyst || !baseMUPAccess.canUpdate;

  useEffect(() => {
    if (!canViewSpecialApproval) {
      return;
    }
  }, [canViewSpecialApproval]);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'view special approval page',
    });
  }, [recordActivity]);


  const {
    data: specialApprovalDetail,
    isFetching: isFetchLoading,
  } = useGetSpecialApprovaDescriptionById({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveSpecialApprovalDescription } = useSaveSpecialApprovalDescription({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = async (shouldGoNext = false) => {
    if (isViewOnlyMode) {
      return;
    }

    const description = await convertToDocx(container);

    await recordActivity({
      activity: ActivityType.SAVE,
      bucketProcessId: String(processId),
      changeAfter: JSON.stringify({
        action: shouldGoNext ? 'Saved Special Approval data and proceeding to next step' : 'Saved Special Approval data',
        processId,
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `save special approval description for ${processId}`,
    });

    saveSpecialApprovalDescription(
      {
        bucketProcessId: String(processId),
        description,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      },
      {
        onSuccess: () => shouldGoNext && goToNextStep(),
      }
    );
  };

  const handleNext = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: String(processId),
      changeAfter: JSON.stringify({
        action: 'Navigating to next step in view-only mode',
        component: 'SpecialApprovalPage',
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'Moving to next step from Special Approval page',
    });
    goToNextStep();
  };

  const autoSavePayload = useMemo(() => async () => {
    if (!container) return null;

    const description = await convertToDocx(container);

    return {
      bucketProcessId: String(processId),
      description,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    };
  }, [container, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !isViewOnlyMode && !!processId,
    payload: autoSavePayload,
    url: 'mip.specialApproval.save',
  });

  return {
    canViewSpecialApproval,
    container,
    handleNext,
    handleSave,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    isViewOnlyMode,
    setContainer,
    specialApprovalDetail,
    viewOnly,
  };
};
