import { useContext, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { analyst } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypePosition } from '@/enums/Position';
import { TypeRoles } from '@/enums/Roles';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetIndustryAnalysisById from './hooks/useGetIndustryAnalysisById';
import useGetIndustryOverviewById from './hooks/useGetIndustryOverviewById';
import useSaveIndustryAnalysis from './hooks/useSaveIndustryAnalysis';
import useSaveIndustryOverview from './hooks/useSaveIndustryOverview';


export const useIndustryAnalysis = () => {
  const [{ currentRole, currentPosition, userData }] = useApp();
  const { processId } = useParams();
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const [state] = useApp();
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();
  const path = usePathname();
  const superior = userData.user.superior;
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const isStaff = currentPosition?.includes(TypePosition.RM);
  const isAnalyst = currentPosition?.includes(TypePosition.ANALYST);
  const isTl = currentRole.includes(TypeRoles.TL);
  const router = useCustomRouter();

  const handleChangeTab = (val: number) => {
    if (!!dirtyMsg) {
      const isConfirmed = window.confirm('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
      if (isConfirmed) {
        setActiveTab(val);
        setDirtyMsg(undefined);
      }
    } else {
      setActiveTab(val);
    }
  };

  const buttons = {};
  let actions = [];

  if (state.stepper) {
    actions = state.stepper.steps.filter((steps) => steps.urlPath === getLastPath(path))[0]?.action;
  }

  if (!!actions) {
    Object.keys(actions).forEach((key) => {
      if (key.includes('ASK_FOR_INFO')) {
        buttons['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
      } else if (key.includes('EDIT')) {
      } else {
        buttons[key] = actions[key];
      }
    });
  }

  const {
    data: overviewDetail,
    isFetching: isFetchOverviewLoading,
  } = useGetIndustryOverviewById(
    {
      bucketProcessId: String(processId),
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    },
    {
      enabled: activeTab === 0,
    }
  );

  const {
    data: analysisDetail,
    isFetching: isFetchAnalysisLoading,
  } = useGetIndustryAnalysisById(
    {
      bucketProcessId: String(processId),
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    },
    {
      enabled: activeTab === 1,
    }
  );

  const { isPending: isSaveOverviewLoading, mutate: saveOverview } = useSaveIndustryOverview({
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({
        onClose: () => shouldGoNext ? setActiveTab(1) : null,
        type: 'success',
      });
    },
  });

  const { isPending: isSaveAnalysisLoading, mutate: saveAnalysis } = useSaveIndustryAnalysis({
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({ onClose: () => shouldGoNext ? goToNextStep() : null, type: 'success' });
    },
  });

  const { data: debtorInfo } = useGetDetailBucketDebtor({
    bucketProcessId: processId as string,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const typeFinancing = debtorInfo?.typeFinancing;

  const isPemda = typeFinancing === 'MUNICIPAL_FINANCING'; //beda sama debtor-information
  const isActionSubmit = isPemda && superior !== null;

  const handleSaveOverview = (blob: Blob) => {
    if (viewOnly || !isStaff) {
      setActiveTab(1);
    } else {
      saveOverview({
        bucketProcessId: String(processId),
        description: blob,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      });
    }
  };

  const handleSaveAnalysis = (blob: Blob) => {
    if (viewOnly || !isAnalyst) {
      goToNextStep();
    } else {
      saveAnalysis({
        bucketProcessId: String(processId),
        description: blob,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      });
    }
  };

  const { isPending: isSubmitLoading, mutate: submit } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Request gagal dikirimkan',
        type: 'error',
      });
    },
  });

  const handleSubmit = (
    { action, showComment = true }: { action: string; showComment?: boolean}
  ) => {
    if (showComment) {
      NiceModal.show(
        MODAL.GLOBAL.COMMENT,
        {
          onSave: ({ comment }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);
            submit({
              submitRequestDto: {
                action: action,
                bucketProcessId: processId as string,
                comment,
                module: state.pages.mipModule,
                process: state.pages.mipProcess,
              },
            }, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
                onSuccess();
              },
            });
          },
        },
      );
    } else {
      submit({
        submitRequestDto: {
          action: action,
          bucketProcessId: processId as string,
          comment: action,
          module: state.pages.mipModule,
          process: state.pages.mipProcess,
        },
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
          onSuccess();
        },
      });
    }
  };

  const onSuccess = () =>
  {
    showNiceModalV2({
      onClose: () => {
        if (isAnalyst) {
          router.push(analyst.LIST_PAGE);
        }
      },
      title: 'Data berhasil dikirim',
      type: 'success',
    });
  };

  return {
    activeTab,
    analysisDetail,
    buttons,
    handleChangeTab,
    handleSaveAnalysis,
    handleSaveOverview,
    handleSubmit,
    isActionSubmit,
    isAnalyst,
    isFetchAnalysisLoading,
    isFetchOverviewLoading,
    isSaveAnalysisLoading,
    isSaveOverviewLoading,
    isStaff,
    isSubmitLoading,
    isTl,
    overviewDetail,
    setActiveTab,
    setShouldGoNext,
    superior,
  };
};
