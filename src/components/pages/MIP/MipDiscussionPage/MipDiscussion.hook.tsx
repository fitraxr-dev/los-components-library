import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import {
  APPROVE,
  CANCELED,
  CLOSE,
  DECLINE,
  positions,
  RETURN_TO_MAKER,
  REJECTED,
  RETURN_TO_ANALYST,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  SAVE,
  SUBMIT,
  roles,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { analyst, mip } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckSubmit from '@/hooks/services/bucket/useCheckSubmit';
import useGetBcmById from '@/hooks/services/bucket/useGetBucketByBcm';
import useGetBucketById from '@/hooks/services/bucket/useGetBucketById';
import useGetConfirmAnalyst from '@/hooks/services/mip/mip-discussion/useGetConfirmAnalyst';
import useSaveConfirmAnalyst from '@/hooks/services/mip/mip-discussion/useSaveConfirmAnalyst';
import useSubmitBucket from '@/hooks/services/processor/useBucketSubmit';
import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';


import { useMIPContext } from '@/components/layouts/MIPLayout/MIP.context';
import Button from '@/components/shared/Button';

import { PemdaEnum } from './MipDiscussion.constants';


const useMipDiscussion = () => {
  const pathname = usePathname();
  const params = useParams<{ processId?: string }>();
  const searchParams = useSearchParams();
  const [state] = useApp();
  const { recordActivity } = useRecordLog();
  const { actions } = useMIPContext();
  const { processId: identityProcessId, parentId } = useIdentity();
  const [isDocumentConfirmed, setIsDocumentConfirmed] = useState(null);
  const [action, setAction] = useState(null);
  const [shouldBackAfterConfirm, setShouldBackAfterConfirm] = useState(false);
  const routeProcessId = params?.processId as string | undefined;
  const currentPath = pathname?.split('/')?.[3] ?? '';
  const bucketMasterIdList = ['DEPI', 'DELS', 'DK', 'DH'];
  const shouldUseParentProcessId = Boolean(
    routeProcessId &&
    currentPath === 'mip' &&
    bucketMasterIdList.includes(routeProcessId.split('-')[0])
  );

  const processId = useMemo(() => {
    if (!routeProcessId) {
      return identityProcessId;
    }

    if (shouldUseParentProcessId) {
      return parentId ?? routeProcessId;
    }

    return routeProcessId;
  }, [routeProcessId, shouldUseParentProcessId, parentId, identityProcessId]);

  const [processIdPrefix] = processId?.split('-') ?? [];
  const currPosition = state.currentPosition;
  const isAnalyst = processIdPrefix === 'MIPA';
  // const isRM = currPosition.includes(positions.RM);
  const isRM = (currPosition ?? []).some((pos) => String(pos)?.includes(positions.RM));
  const isTL = state.currentRole?.includes(positions.TL);
  const isStaff = state?.currentRole?.includes(roles.RM);
  const isSuperAdminMaker = state?.currentRole?.includes(roles.MAKER);
  const isSuperAdminChecker = state?.currentRole?.includes(roles.CHECKER);
  const isStaffSuperAdmin = state?.currentPosition?.includes('TASK_FORCE');
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const ownerId = searchParams.get('ownerId');

  const MipPrefix = {
    'MIP': { module: TypeModule.MIP, process: TypeProcess.MIP },
    'MIPA': { module: TypeModule.MIP, process: TypeProcess.MIP_ANALYST },
    'MIPR': { module: TypeModule.MIP_REVIEW, process: TypeProcess.MIP_REVIEW },
    'MREV': { module: TypeModule.MIP_REVIEW, process: TypeProcess.MIP_REVIEW_REVISION },
  };

  const _module: TypeModule = MipPrefix[processIdPrefix]?.module;
  const process: TypeProcess = MipPrefix[processIdPrefix]?.process;

  const { data: bucketData } = useGetBucketById({
    bucketProcessId: processId,
    module: _module,
    process: process,
  });

  const currentStaffName = bucketData?.staffName;
  const divisionCode = bucketData?.divisionCode?.toUpperCase?.();
  const analystId = bucketData?.analystId;

  const isPemda = (Object).values<string>(PemdaEnum).includes(bucketData?.institutionType);
  const isDppuDivision = ['DPPU1', 'DPPU3'].includes(divisionCode ?? '');

  const { data: bcmData, isSuccess: isGetBcmSuccess } = useGetBcmById({
    bcmId: bucketData?.bucketMaster,
    module: _module,
    process: process,
  });

  const bucketMasterId = bcmData?.bucketMaster;

  const { data: confirmAnalystData } = useGetConfirmAnalyst({
    bucketMasterId,
    bucketProcessId: processId,
  }, {
    enabled: isGetBcmSuccess,
  });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  // const shouldValidateSubmitPermission = useMemo(() => (
  //   ['MIP_CREATION', 'RETURN_TO_STAFF'].includes(stepperData?.from ?? '')
  // ), [stepperData?.from]);

  const checkSubmitPayload = useMemo(() => ({
    bucketMasterId: bucketMasterId ? bucketMasterId : '',
    process: process ? process : '',
  }), [bucketMasterId, process]);

  const isCheckSubmitEnabled =
    Boolean(checkSubmitPayload.bucketMasterId) &&
    Boolean(checkSubmitPayload.process) &&
    !isAnalyst;

  const {
    data: checkSubmitResult = false,
  } = useCheckSubmit(checkSubmitPayload, {
    enabled: isCheckSubmitEnabled,
  });

  const isSubmitAllowedByCheck = isCheckSubmitEnabled ? checkSubmitResult : true;


  const { mutate: saveConfirmAnalyst } = useSaveConfirmAnalyst({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['document-discussion-staff-list']});
      queryClient.invalidateQueries({ queryKey: ['document-discussion-analyst-list']});
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: String(processId),
        changeAfter: `Status document: ${isDocumentConfirmed}`,
        changeBefore: 'Status document: not confirmed ',
        menuCode: 'mip',
        module: state.pages?.mipModule,
        process: state.pages?.mipProcess,
        remarks: `Confirm status document analyst from module ${state.pages?.mipModule}`,
      });
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          if (shouldBackAfterConfirm) {
            handleBackToListPage();
            setShouldBackAfterConfirm(false);
          }
        },
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      recordActivity({
        activity: action as ActivityType ?? ActivityType.SUBMIT,
        bucketProcessId: String(processId),
        menuCode: 'mip',
        module: state.pages?.mipModule,
        process: state.pages?.mipProcess,
        remarks: `Submit pembahasan mip with action ${action}`,
      });
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          handleBackToListPage();
        },
        title: 'Data berhasil dikirim',
        type: 'success',
      });
    },
  });

  useEffect(() => {
    if (confirmAnalystData) {
      setIsDocumentConfirmed(confirmAnalystData?.isAnalystConfirm);
    }
  }, [confirmAnalystData]);


  const handleOnDecline = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      isRadioMandatory: true,
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          action: radioValue,
          bucketProcessId: processId,
          comment,
          module: _module,
          process,
        });
      },
      radioLabel: 'Declined',
      radioOptions: [
        { label: 'Canceled', value: 'CANCEL' },
        { label: 'Rejected', value: 'REJECT' },
      ],
    });
  };

  const handleSubmitConfirmAnalyst = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        setAction(action);
        setShouldBackAfterConfirm(true);
        saveConfirmAnalyst({
          action,
          analystId: bucketData?.analystId,
          bucketMasterId: bcmData?.bucketMaster,
          bucketProcessId: processId,
          comment: comment,
          isAnalystConfirm: isDocumentConfirmed,
          isPemda: isPemda,
          module: _module,
          process,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleSave = () => {
    setAction(SAVE);
    setShouldBackAfterConfirm(false);
    saveConfirmAnalyst({
      analystId: bucketData?.analystId,
      bucketMasterId: bcmData?.bucketMaster,
      bucketProcessId: processId,
      isAnalystConfirm: isDocumentConfirmed,
      module: _module,
      process,
    });
  };

  const handleSubmit = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        setAction(action);
        submitBucket({
          action,
          bucketProcessId: processId,
          comment,
          module: _module,
          process,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleSubmitApprove = (action: string) => {
    if (isAnalyst) {
      handleSubmitConfirmAnalyst(isStaff && isPemda && isDppuDivision ? 'SUBMIT' : 'COMPLETE');
    } else {
      handleSubmit(action);
    }
  };

  const handleBackToListPage = () => {
    if (isAnalyst) {
      router.push(analyst.LIST_PAGE);
    } else {
      router.push(mip.LIST_PAGE);
    }
  };

  const autoSavePayload = useMemo(() => () => {

    return Promise.resolve({
      analystId: analystId,
      bucketMasterId: bucketMasterId,
      bucketProcessId: processId,
      isAnalystConfirm: isDocumentConfirmed,
      module: _module,
      process,
    });
  }, [processId, bucketMasterId, analystId, isDocumentConfirmed, _module, process]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: isDocumentConfirmed !== null && !!confirmAnalystData,
    payload: autoSavePayload,
    url: 'mip.mipDiscussion.saveConfirmAnalyst',
  });

  // const renderActions = useMemo(() => {
  //   if (isAnalyst && !isStaff) {
  //     return {
  //       TABLE_UPLOAD_DOCUMENT_DOWNLOAD: 'TABLE_UPLOAD_DOCUMENT_DOWNLOAD',
  //     };
  //   } else {
  //     return {
  //       TABLE_UPLOAD_DOCUMENT_DELETE: 'TABLE_UPLOAD_DOCUMENT_DELETE',
  //       TABLE_UPLOAD_DOCUMENT_DOWNLOAD: 'TABLE_UPLOAD_DOCUMENT_DOWNLOAD',
  //       TABLE_UPLOAD_DOCUMENT_EDIT: 'TABLE_UPLOAD_DOCUMENT_EDIT',
  //       TABLE_UPLOAD_DOCUMENT_PREVIEW: 'TABLE_UPLOAD_DOCUMENT_PREVIEW',
  //     };
  //   }
  // }, []);
  const progress = stepperData?.progress ?? 0;
  const isProgressNotCompleted = progress < 100;

  const isSubmitDisabled =
    !isSubmitAllowedByCheck || isProgressNotCompleted ||
    ((isAnalyst || isRM) && isDocumentConfirmed === null);

  const buttonDictionary = [CLOSE,
    DECLINE,
    RETURN_TO_STAFF,
    RETURN_TO_TL,
    RETURN_TO_ANALYST,
    RETURN_TO_MAKER,
    SAVE,
    SUBMIT,
    APPROVE];

  const renderActionButtons = () => {
    if (JSON.stringify(actions) === '{}') {
      return null;
    }

    let buttonContents = [];

    for (const key in actions) {
      if (buttonDictionary.includes(key)) {
        const indexByKeyInButtonDictionary = buttonDictionary.indexOf(key);
        buttonContents[indexByKeyInButtonDictionary] = [key, actions[key]];
      }
    }

    const buttonList = buttonContents.map((button) => {
      const [key, value] = button;

      switch (key) {
        case RETURN_TO_MAKER:
          return (
            <Button
              color="darkBlue"
              onClick={() => handleSubmit(value)}
            >
              Return to Maker
            </Button>
          );
        case RETURN_TO_STAFF:
          return (
            <Button
              color="darkBlue"
              onClick={() => handleSubmit(value)}
            >
              Return to Staff
            </Button>
          );
        case RETURN_TO_TL:
          return (
            <Button
              color="info"
              onClick={() => handleSubmit(value)}
            >
              Return to TL
            </Button>
          );
        case RETURN_TO_ANALYST:
          return (
            <Button
              color="info"
              onClick={() => handleSubmit(value)}
            >
              Return to Analyst
            </Button>
          );
        case SAVE:
          return (
            <Button
              disabled={isDocumentConfirmed === null || isAutoSaveFetching}
              isLoading={isSubmitLoading}
              onClick={handleSave}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
          );
        case SUBMIT:
          return (
            <Button
              color="success"
              disabled={isSubmitDisabled}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmitApprove(value)}
            >
              { isRM || isTL || isStaff || isSuperAdminMaker ? 'Submit' : 'Approve'}
            </Button>
          );
        case APPROVE:
          return (
            <Button
              color="success"
              disabled={isSubmitDisabled}
              onClick={() => handleSubmitApprove(value)}
            >
              { isRM || isTL || isStaff ? 'Submit' : 'Approve'}
            </Button>
          );
        case DECLINE:
          return (
            <Button
              variant="outlined"
              color="error"
              onClick={handleOnDecline}
            >
              Decline
            </Button>
          );
        default:
          break;
      }
    });

    return buttonList;
  };

  return {
    _module,
    analystId,
    bucketMasterId,
    currentStaffName,
    handleBackToListPage,
    isAnalyst,
    isDocumentConfirmed,
    isGetBcmSuccess,
    isRM,
    isStaff,
    isStaffSuperAdmin,
    isSuperAdminChecker,
    isSuperAdminMaker,
    isTL,
    ownerId,
    process,
    processId,
    renderActionButtons,
    // renderActions,
    setIsDocumentConfirmed,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
  };
};

export default useMipDiscussion;
