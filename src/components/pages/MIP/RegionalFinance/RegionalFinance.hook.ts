import { useContext, useMemo, useState } from 'react';

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
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';


import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetRegionalFinanceById from './hooks/useGetRegionalFinanceById';
import useSaveRegionalFinance from './hooks/useSaveRegionalFinance';


export const useRegionalFinance = (container: any) => {
  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();
  const [state] = useApp();
  const currentPosition = state.currentPosition;
  const currentRole = state.currentRole;
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const queryClient = useQueryClient();
  const path = usePathname();
  const superior = state.userData.user.superior;
  const isAnalyst = currentPosition?.includes(TypePosition.ANALYST);
  const isTl = currentRole.includes(TypeRoles.TL);
  const router = useCustomRouter();
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

  const { isPending: isSubmitLoading, mutate: submit } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Request gagal dikirimkan',
        type: 'error',
      });
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

  const {
    data: regionalFinanceDetail,
    isFetching: isFetchLoading,
  } = useGetRegionalFinanceById({
    bucketProcessId: processId as string,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveRegionalFinance } = useSaveRegionalFinance({
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
      saveRegionalFinance({
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
    isActive: !viewOnly && !!regionalFinanceDetail && !!container,
    payload: autoSavePayload,
    url: 'mip.hr.saveRegional',
  });

  return {
    buttons,
    handleSave,
    handleSubmit,
    isActionSubmit,
    isAnalyst,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    isSubmitLoading,
    isTl,
    regionalFinanceDetail,
    setShouldGoNext,
    superior,
  };
};
