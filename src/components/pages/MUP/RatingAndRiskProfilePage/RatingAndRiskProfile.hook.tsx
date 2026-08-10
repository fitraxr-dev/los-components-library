import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailRiskProfile from '@/hooks/services/mip/risk-profile/useGetDetailRiskProfile';
import useSaveRiskProfile from '@/hooks/services/mip/risk-profile/useSaveRiskProfile';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';

import { modal } from './RatingAndRiskProfile.constants';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


export const useRatingAndRiskProfilePage = () => {
  const { goToNextStep } = useMUPContext();
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();

  const { setDirtyMsg } = useContext(DirtyContext);
  const queryClient = useQueryClient();

  const [internalContainerRiskProfile, setInternalContainerRiskProfile] =
    useState<DocumentEditorContainerComponent>(null);

  const containerRiskProfile = internalContainerRiskProfile;

  const setContainerRiskProfile = (container: DocumentEditorContainerComponent) => {
    setInternalContainerRiskProfile(container);
  };

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const tab = searchParams?.get('tab');

    if (tab === 'risk-profile') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [searchParams]);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({
        component: 'RatingAndRiskProfilePage',
        initialTab: searchParams?.get('tab') || 'rating',
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'Initialize Rating and Risk Profile page',
    });
  }, [processId, recordActivity, searchParams]);


  const { data, isLoading: isRiskProfileLoading } = useGetDetailRiskProfile({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });


  const handleOpenHistoryModal = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({
        action: 'Opened Rating History Modal',
        component: 'RatingAndRiskProfilePage',
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'Viewing Rating history',
    });

    NiceModal.show(modal.HISTORY_RATING);
  };

  const riskProfileData = data?.description;

  const { mutate: saveRiskProfile } = useSaveRiskProfile({
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
      queryClient.invalidateQueries({ queryKey: ['f', {
        bucketProcessId: processId,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      }]});
    },
  });

  const handleChangeTab = (val: number) => {
    const tabName = val === 0 ? 'rating' : 'risk-profile';

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({
        component: 'RatingAndRiskProfilePage',
        tabChange: `Switched to ${tabName} tab`,
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `Viewing ${val === 0 ? 'Rating' : 'Risk Profile'} tab`,
    });

    if (val === 0) {
      router.push(`${pathname}?tab=rating`);
    }
    if (val === 1) {
      router.push(`${pathname}?tab=risk-profile`);
    }
  };

  const handleNext = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({
        action: activeTab === 0 ? 'Navigating from Rating tab to Risk Profile tab' : 'Navigating to next step in view-only mode',
        component: 'RatingAndRiskProfilePage',
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: activeTab === 0 ? 'Moving from Rating tab to Risk Profile tab' : 'Moving to next step from Rating and Risk Profile page',
    });

    if (activeTab === 0) {
      handleChangeTab(1);
    } else {
      goToNextStep();
    }
  };

  const handleSave = async (shouldGoNext = false) => {
    if (activeTab === 0) {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({
          action: 'Moving from Rating tab to Risk Profile tab on save',
          component: 'RatingAndRiskProfilePage',
        }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
        remarks: 'Saved Rating and moved to Risk Profile tab',
      });

      router.push(`${pathname}?tab=risk-profile`);
      setActiveTab(1);
      return;
    }

    const description = await convertToDocx(containerRiskProfile);

    await recordActivity({
      activity: ActivityType.SAVE,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({
        action: shouldGoNext ? 'Saved Risk Profile data and proceeding to next step' : 'Saved Risk Profile data',
        component: 'RatingAndRiskProfilePage',
        contentSaved: !!description,
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'Saved Risk Profile information',
    });

    saveRiskProfile(
      {
        bucketProcessId: processId,
        description: description,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      },
      {
        onSuccess: () => shouldGoNext && goToNextStep(),
      }
    );
  };

  const autoSavePayload = useMemo(() => async () => {
    if (!internalContainerRiskProfile) return null;

    const description = await convertToDocx(internalContainerRiskProfile);

    return {
      bucketProcessId: processId,
      description: description,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    };
  }, [internalContainerRiskProfile, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly && !!processId && activeTab === 1,
    payload: autoSavePayload,
    url: 'mip.riskProfile.save',
  });

  return {
    activeTab,
    containerRiskProfile,
    handleChangeTab,
    handleNext,
    handleOpenHistoryModal,
    handleSave,
    isAutoSaveFetching,
    isRiskProfileLoading,
    processId,
    recordActivity,
    riskProfileData,
    setContainerRiskProfile,
    viewOnly,
  };
};
