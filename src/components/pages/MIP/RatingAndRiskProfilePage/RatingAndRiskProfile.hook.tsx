import { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailRiskProfile from '@/hooks/services/mip/risk-profile/useGetDetailRiskProfile';
import useSaveRiskProfile from '@/hooks/services/mip/risk-profile/useSaveRiskProfile';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import { modal } from './RatingAndRiskProfile.constants';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


export const useRatingAndRiskProfilePage = () => {
  const { processId } = useIdentity();
  const [state] = useApp();
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();

  const { setDirtyMsg } = useContext(DirtyContext);
  const queryClient = useQueryClient();
  const [shouldGoNext, setShouldGoNext] = useState(false);

  const [containerRiskProfile, setContainerRiskProfile] = useState<DocumentEditorContainerComponent>(null);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const tab = searchParams?.get('tab');

    if (tab === 'risk-profile') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [searchParams]);

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { data, isLoading: isRiskProfileLoading } = useGetDetailRiskProfile({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
  });


  const handleOpenHistoryModal = () => {
    NiceModal.show(modal.HISTORY_RATING);
  };

  const riskProfileData = data?.description;

  const { isPending: isSaveLoading, mutate: saveRiskProfile } = useSaveRiskProfile({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose: () => {
          queryClient.invalidateQueries({ queryKey: ['risk-profile-detail', {
            bucketProcessId: processId,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.MIP_REVIEW,
          }]});
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      shouldGoNext ? goToNextStep() : null;
    },
  });

  const handleChangeTab = (val: number) => {
    if (val === 0) {
      router.push(`${pathname}?tab=rating`);
    }
    if (val === 1) {
      router.push(`${pathname}?tab=risk-profile`);
    }
  };

  const handleSave = async () => {
    if (activeTab === 0) {
      router.push(`${pathname}?tab=risk-profile`);

      setActiveTab(1);
    } else {
      const description = await convertToDocx(containerRiskProfile);
      saveRiskProfile({
        bucketProcessId: processId,
        description: description,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.MIP_REVIEW,
      });
    }
  };

  return {
    activeTab,
    containerRiskProfile,
    handleChangeTab,
    handleOpenHistoryModal,
    handleSave,
    isRiskProfileLoading,
    processId,
    riskProfileData,
    setContainerRiskProfile,
    setShouldGoNext,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    viewOnly,
  };
};
