import { useContext, useState, useMemo } from 'react';

import { DirtyContext } from '@/contexts/DirtyContext';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailBucketDebtor from '@/hooks/services/bucket/debtor/useGetDetailBucketDebtor';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetSpecialApprovaDescriptionById from './hooks/useGetSpecialApprovalDescriptionById';
import useSaveSpecialApprovalDescription from './hooks/useSaveSpecialApprovalDescription';


export const useSpecialApproval = () => {
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const { goToNextStep } = useContext(MIPContext);
  const { setDirtyMsg } = useContext(DirtyContext);
  const [container, setContainer] = useState(null);
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [state] = useApp();


  const {
    data: specialApprovalDetail,
    isFetching: isFetchLoading,
  } = useGetSpecialApprovaDescriptionById({
    bucketProcessId: processId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  }, { enabled: !!processId && !!state.pages.mipModule && !!state.pages.mipProcess });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
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
      shouldGoNext ? goToNextStep() : null;
    },
  });

  // Auto-save payload
  const autoSavePayload = useMemo(() => async () => {
    const description = container ? await convertToDocx(container) : null;

    return {
      bucketProcessId: String(processId),
      description,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    };
  }, [container, processId, state.pages.mipModule, state.pages.mipProcess]);

  // Auto-save
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    isActive: !viewOnly && !!specialApprovalDetail,
    payload: autoSavePayload,
    url: 'mip.specialApproval.save',
  });

  const handleSave = async () => {
    const description = await convertToDocx(container);

    if (viewOnly) {
      goToNextStep();
    } else {
      saveSpecialApprovalDescription({
        bucketProcessId: String(processId),
        description,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      });
    }
  };

  return {
    bucketMasterId: debtorInfoData?.bucketMasterId,
    container,
    handleSave,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    setContainer,
    setShouldGoNext,
    specialApprovalDetail,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    viewOnly,
  };
};
