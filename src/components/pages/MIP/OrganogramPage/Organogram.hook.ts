import { useContext, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetOrganogramById from './hooks/useGetOrganogramById';
import useSaveOrganogram from './hooks/useSaveOrganogram';


export const useOrganogram = (container: any) => {
  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [state] = useApp();
  const { goToNextStep } = useContext(MIPContext);
  const { debtorId } = useIdentity();
  const router = useCustomRouter();
  const { viewOnly } = useViewOnly();

  const [shouldGoNext, setShouldGoNext] = useState(false);

  const {
    data: organogramDetail,
    isFetching: isFetchLoading,
  } = useGetOrganogramById({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  // Save Pipeline
  const { isPending: isSaveLoading, mutate: saveOrganogram } = useSaveOrganogram({
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({ onClose: () => shouldGoNext ? goToNextStep() : null, type: 'success' });
    },
  });

  const handleManagementShareholder = () => {
    const path = replacePath(maintenanceDebtor.MAINTENANCE_DETAIL_PAGE, { processId: debtorId });
    router.replace(path);
  };

  const handleSave = (blob: Blob) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      saveOrganogram({
        bucketProcessId: String(processId),
        description: blob,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      });
    }
  };

  const autoSavePayload = useMemo(() => async () => {

    const blob = await convertToDocx(container);

    return {
      bucketProcessId: String(processId),
      description: blob,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    };
  }, [container, processId, state.pages.mipModule, state.pages.mipProcess]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!organogramDetail && !!container,
    payload: autoSavePayload,
    url: 'mip.hr.saveOrgan',
  });

  return {
    handleManagementShareholder,
    handleSave,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    organogramDetail,
    setShouldGoNext,
  };
};
