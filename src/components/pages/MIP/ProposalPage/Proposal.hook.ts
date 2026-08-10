import { useContext, useEffect, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';


import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { mip, analyst } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetProposalDetail from '@/hooks/services/mip/proposal/useGetProposalDetail';
import useSaveProposal from '@/hooks/services/mip/proposal/useSaveProposal';
import useBucketSubmit from '@/hooks/services/processor/useBucketSubmit';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import { modal } from './Proposal.constants';


export const useProposal = (container: any) => {
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [state, _] = useApp();
  const queryClient = useQueryClient();
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();


  const isAnalyst = state.currentRole.includes(roles.ANALYST) || state.currentRole.includes(roles.TL_ANALYST);

  const onSuccess = (action) => {
    setDirtyMsg(undefined);
    if (action === 'SUBMIT') {
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: String(processId),
        menuCode: 'mip',
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
        remarks: `Submit MIP with Id: ${String(processId)} from status MIP REVISION`,
      });
      showNiceModalV2({
        onClose: () => {
          if (isAnalyst) {
            router.push(analyst.LIST_PAGE);
          } else {
            router.push(mip.LIST_PAGE);
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    } else if (action === 'CANCEL') {
      recordActivity({
        activity: ActivityType.CANCEL,
        bucketProcessId: String(processId),
        menuCode: 'mip',
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
        remarks: `Cancel MIP with Id: ${String(processId)} from status MIP REVISION`,
      });
      showNiceModalV2({
        onClose: () => {
          if (isAnalyst) {
            router.push(analyst.LIST_PAGE);
          } else {
            router.push(mip.LIST_PAGE);
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });

    } else if (action === 'RETURN_STAFF') {
      recordActivity({
        activity: ActivityType.RETURN_TO_STAFF,
        bucketProcessId: String(processId),
        menuCode: 'mip',
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
        remarks: `Send back MIP to staff with Id: ${String(processId)} from status MIP REVISION`,
      });
      showNiceModalV2({
        onClose: () => {
          if (isAnalyst) {
            router.push(analyst.LIST_PAGE);
          } else {
            router.push(mip.LIST_PAGE);
          }
        },
        title: 'MIP berhasil dikirimkan untuk approval RM',
        type: 'success',
      });
    } else if (action === 'RETURN_TL') {
      recordActivity({
        activity: ActivityType.RETURN_TO_STAFF,
        bucketProcessId: String(processId),
        menuCode: 'mip',
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
        remarks: `Send back MIP to TL with Id: ${String(processId)} from status MIP REVISION`,
      });
      showNiceModalV2({
        onClose: () => {
          if (isAnalyst) {
            router.push(analyst.LIST_PAGE);
          } else {
            router.push(mip.LIST_PAGE);
          }
        },
        title: 'MIP berhasil dikirimkan untuk approval TL',
        type: 'success',
      });
    } else if (action === 'CREATE_MEMO_SUPP') {
      recordActivity({
        activity: ActivityType.RETURN_TO_STAFF,
        bucketProcessId: String(processId),
        menuCode: 'mip',
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
        remarks: `Create Memo Supplement MIP with Id: ${String(processId)} from status MIP REVISION`,
      });
      showNiceModalV2({
        onClose: () => {
          router.push(
            replacePath(
              mip.MEMO_SUPPLEMENT_PAGE,
              {
                processId: processId,
              },
            ),
          );
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    }
  };

  const {
    data: proposalDetail,
    isFetching: isFetchLoading,
  } = useGetProposalDetail({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { isPending: isSaveLoading, mutate: saveProposal } = useSaveProposal({
    onSuccess: () => {
      setDirtyMsg(undefined);

      showNiceModalV2({
        type: 'success',
      });
    },
  });

  const handleSubmit = (
    { process, action, showComment = true }: { process: string; action: string; showComment?: boolean }
  ) => {
    if (showComment) {
      NiceModal.show(
        MODAL.GLOBAL.COMMENT,
        {
          onSave: ({ comment }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);
            submitProposal({
              action: action,
              bucketProcessId: processId,
              comment,
              module: state.pages.mipModule,
              process: state.pages.mipProcess,
            }, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
                onSuccess(action);
              },
            });
          },
        },
      );
    } else {
      submitProposal({
        action: action,
        bucketProcessId: processId,
        comment: action,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
          onSuccess(action);
        },
      });
    }
  };

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { isPending: submitProposalLoading, mutate: submitProposal } = useBucketSubmit({
    onError: () => {
      showNiceModalV2({
        title: 'MIP gagal dikirimkan',
        type: 'error',
      });
    },
  });

  const handleOpenDeclineModal = () => {
    NiceModal.show(modal.DECLINE);
  };

  const handleSave = (blob: Blob) => {
    saveProposal({
      bucketProcessId: String(processId),
      description: blob,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    });
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
    isActive: !viewOnly && !isAnalyst && !!proposalDetail && !!container,
    payload: autoSavePayload,
    url: 'mip.proposal.save',
  });

  return {
    goToNextStep,
    handleOpenDeclineModal,
    handleSave,
    handleSubmit,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    processId,
    proposalDetail,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    submitProposalLoading,
  };
};
