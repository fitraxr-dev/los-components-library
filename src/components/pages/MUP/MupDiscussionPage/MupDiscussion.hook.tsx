import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import {
  APPROVE,
  CANCELED,
  CLOSE,
  DECLINE,
  positions,
  REJECTED,
  RETURN_TO_ANALYST,
  RETURN_TO_MAKER,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { mup } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckSubmit from '@/hooks/services/bucket/useCheckSubmit';
import useGetBcmById from '@/hooks/services/bucket/useGetBucketByBcm';
import useGetBucketById from '@/hooks/services/bucket/useGetBucketById';
import useGetConfirmAnalyst from '@/hooks/services/mip/mip-discussion/useGetConfirmAnalyst';
import useSubmitBucket from '@/hooks/services/processor/useBucketSubmit';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import Button from '@/components/shared/Button';


const useMupDiscussion = () => {
  const searchParams = useSearchParams();
  const [state] = useApp();
  const { actionButtons } = useMUPContext();
  const { processId } = useIdentity();
  const [isDocumentConfirmed, setIsDocumentConfirmed] = useState(false);
  const [isDoucmentAvailable, setIsDoucmentAvailable] = useState(false);
  const [activity, setActivity] = useState('');
  const stepperStatus = state.stepper.from;
  const currPosition = state.currentPosition;
  const currentRole = state.currentRole;
  const isRM = currPosition.includes(positions.RM);
  const isKadiv = currentRole?.includes('KADIV');
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const { recordActivity } = useRecordLog();
  const ownerId = searchParams.get('ownerId');
  const isApproveButtonLabel = isKadiv || (!isKadiv && stepperStatus === 'WAITING_APPROVAL_KADIV');


  const _module: TypeModule = TypeModule.MUP;
  const process: TypeProcess = TypeProcess.MUP;

  const { data: bucketData } = useGetBucketById({
    bucketProcessId: processId,
    module: _module,
    process: process,
  });

  const currentStaffName = bucketData?.staffName;
  const analystId = bucketData?.analystId;

  const { data: bcmData, isSuccess: isGetBcmSuccess } = useGetBcmById({
    bcmId: bucketData?.bucketMaster,
    module: _module,
    process: process,
  });

  const bucketMasterId = bcmData?.bucketMaster;


  const { data: confirmAnalystData } = useGetConfirmAnalyst({
    bucketMasterId: bucketMasterId,
    bucketProcessId: processId,
  });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: _module,
    process: process,
  });

  const checkSubmitPayload = useMemo(() => ({
    bucketMasterId: bucketMasterId ?? '',
    process: process ?? '',
  }), [bucketMasterId, process]);

  const isCheckSubmitEnabled =
    Boolean(checkSubmitPayload.bucketMasterId) &&
    Boolean(checkSubmitPayload.process);

  const {
    data: checkSubmitResult = false,
  } = useCheckSubmit(checkSubmitPayload, {
    enabled: isCheckSubmitEnabled,
  });

  const isSubmitAllowedByCheck = isCheckSubmitEnabled ? checkSubmitResult : true;

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      recordActivity({
        activity: activity as ActivityType ?? ActivityType.SUBMIT,
        bucketProcessId: processId,
        menuCode: 'mup',
        module: _module,
        process: process,
        remarks: `Submit MUP with activity ${activity}`,
      });
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          handleBackToListPage();
        },
        title: 'Data berhasil disubmit',
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
        setActivity(radioValue);
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
        { label: 'Canceled', value: CANCELED },
        { label: 'Rejected', value: REJECTED },
      ],
    });
  };

  const handleSubmit = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        setActivity(action);
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

  const handleBackToListPage = () => {
    router.push(mup.LIST_PAGE);
  };

  const progress = stepperData?.progress ?? 0;
  const isProgressNotCompleted = progress < 100;

  const isSubmitDisabled =
    !isSubmitAllowedByCheck ||
    isProgressNotCompleted ||
    (isDoucmentAvailable ? !isDocumentConfirmed : true);

  const buttonDictionary = [
    CLOSE,
    DECLINE,
    RETURN_TO_STAFF,
    RETURN_TO_TL,
    RETURN_TO_MAKER,
    RETURN_TO_ANALYST,
    SUBMIT,
    APPROVE,
  ];

  const renderActionButtons = () => {
    if (JSON.stringify(actionButtons) === '{}') {
      return null;
    }

    let buttonContents = [];

    for (const key in actionButtons) {
      if (buttonDictionary.includes(key)) {
        const indexByKeyInButtonDictionary = buttonDictionary.indexOf(key);
        buttonContents[indexByKeyInButtonDictionary] = [key, actionButtons[key]];
      }
    }

    const buttonList = buttonContents.map((button) => {
      const [key, value] = button;

      switch (key) {
        case CLOSE:
          return (
            <Button
              variant="outlined"
              onClick={handleBackToListPage}
            >
              Close
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
        case RETURN_TO_MAKER:
          return (
            <Button
              color="darkBlue"
              onClick={() => handleSubmit(value)}
            >
              Return to Maker
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
        case SUBMIT:
          return (
            <Button
              color="success"
              disabled={isSubmitDisabled}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmit(value)}
            >
              {(isApproveButtonLabel) ? 'Approve' : 'Submit'}
            </Button>
          );
        case APPROVE:
          return (
            <Button
              color="success"
              disabled={isSubmitDisabled}
              onClick={() => handleSubmit(value)}
            >
              {(isApproveButtonLabel) ? 'Approve' : 'Submit'}
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

  const callbackTableDocumentMUP = (params) => {
    if (params?.length > 0) {
      setIsDoucmentAvailable(true);
    } else {
      setIsDoucmentAvailable(false);
    }
  };

  return {
    _module,
    analystId,
    bucketMasterId,
    callbackTableDocumentMUP,
    currentStaffName,
    isGetBcmSuccess,
    isRM,
    ownerId,
    process,
    renderActionButtons,
  };
};

export default useMupDiscussion;
