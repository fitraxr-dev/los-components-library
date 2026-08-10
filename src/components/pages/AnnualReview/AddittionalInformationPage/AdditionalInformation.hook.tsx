import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import {
  APPROVE,
  APPROVE_ASK_FOR_INFO,
  ASK_FOR_INFO,
  CANCELED,
  CLOSE,
  COMPLETE,
  DECLINE,
  MAX_STEP_PERCENTAGE,
  REJECTED,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  RETURN_TO_ANALYST,
  SAVE,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useCheckRequest from '@/hooks/services/bucket/debtor/useCheckRequest';
import useCheckSubmit from '@/hooks/services/bucket/useCheckSubmit';
import useGetBcmById from '@/hooks/services/bucket/useGetBucketByBcm';
import useGetBucketById from '@/hooks/services/bucket/useGetBucketById';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import Button from '@/components/shared/Button';


import {
  FORWARD_SUBMIT_HIGH_RISK,
  FORWARD_TO_DK,
  FORWARD_TO_DPOP,
  listTitleModalSubmitBucket,
} from '../../ApuPpt/CustomerDueDiligencePage/CustomerDueDiligance.constants';

import useGetAdditionalInformationById from './hooks/useGetAdditionalInformationById';
import useSaveAdditionalInformation from './hooks/useSaveAdditionalInformation';


export const useAdditionalInformation = () => {
  const { processId, pageModule }: { processId: string; pageModule: string } = useParams();
  const pathname = usePathname();
  const titleHeader = pathname?.includes('/additional-information')
    ? 'Additional Information'
    : 'Pembahasan Annual Review';
  const { setDirtyMsg } = useContext(DirtyContext);
  const [container, setContainer] = useState(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    additionalWord: true,
  });
  const [act, setAct] = useState('');
  const [isDocumentConfirmed, setIsDocumentConfirmed] = useState(false);
  const isPreview = Boolean(useSearchParams().get('isPreview'));
  const { viewOnly, setViewOnly } = useViewOnly();
  const [{ stepper }] = useApp();
  const {
    actions,
    isRM,
    isTL,
    isDepiDivision,
    isKadiv,
    isAnalyst,
    isBusinessDivision,
    isMaker,
    goToNextStep,
    typeProcess,
  } = useAnnualReviewContext();
  const currentBucketStatus = stepper.from;

  const [disclaimer, setDisclaimer] = useState('');
  const listPagePathByCurrentProcess = `/annual-review/${pageModule}`;
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const buttonListTemplateByKey = [CLOSE, 'CANCELED', DECLINE, RETURN_TO_STAFF, RETURN_TO_TL, RETURN_TO_ANALYST, SAVE, ASK_FOR_INFO, SUBMIT, 'FORWARD_SUBMIT', 'FORWARD_SUBMIT_HIGH_RISK', 'SAVE_NEXT', 'NEXT', APPROVE, COMPLETE, APPROVE_ASK_FOR_INFO];
  const isApdb = useMemo(() => {
    const bucketApdb = processId?.split('-')[0] === 'APDP';
    return bucketApdb;
  }, [processId]);

  const isAnnualReviewBisnis = useMemo(() => {
    const bucketPrefix = processId?.split('-')[0];
    return bucketPrefix === 'ANR';
  }, [processId]);

  const isAnnualReviewAnalyst = useMemo(() => {
    const bucketPrefix = processId?.split('-')[0];
    return bucketPrefix === 'ANRA';
  }, [processId]);

  const isAskforInfoKadiv = useMemo(() => {
    let askForInfoKadiv = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('COMPLETED_ASK_FOR_INFO')) {
      askForInfoKadiv = true;
    }
    return askForInfoKadiv;
  }, [actions]);

  const isWaitingAskForInfoKadiv = stepper.from === 'ASK_FOR_INFO_WAITING_APPROVAL_KADIV_EDITED';

  const isSynfunsionDisabled = useMemo(() => {
    let disabled = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('VIEW_ONLY')) {
      disabled = true;
    }
    const disabledStatuses = [
      'ANNUAL_REVIEW_RATING_HISTORY',
      'WAITING_APPROVAL_TL_RATING_HISTORY',
      'RETURN_TO_STAFF_RATING_HISTORY',
    ];
    if (disabledStatuses.includes(currentBucketStatus)) {
      disabled = true;
    }

    return disabled;
  }, [actions, currentBucketStatus]);

  const isHistoryRating = useMemo(() => {
    const historyStatuses = [
      'ANNUAL_REVIEW_RATING_HISTORY',
      'WAITING_APPROVAL_TL_RATING_HISTORY',
      'RETURN_TO_STAFF_RATING_HISTORY',
    ];
    return historyStatuses.includes(currentBucketStatus);
  }, [currentBucketStatus]);

  const {
    data: additionalInformationDetail,
    isFetching: isFetchLoading,
    isLoading,
  } = useGetAdditionalInformationById({
    bucketProcessId: String(processId),
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const { data: bucketData } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const debtorInstitutionType = bucketData?.institutionType;
  const isPemda = DebtorNamesetResponseDtoRegionalGovernEnum
    ? Object.values(DebtorNamesetResponseDtoRegionalGovernEnum).includes(
      debtorInstitutionType as DebtorNamesetResponseDtoRegionalGovernEnum)
    : false;

  const { data: bcmData } = useGetBcmById({
    bcmId: bucketData?.bucketMaster,
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const bucketMasterId = bcmData?.bucketMaster;

  const { data: checkRequestData } = useCheckRequest({
    bucketMasterId: bucketMasterId || '',
    process: typeProcess || '',
  });

  const isCheckRequestAlerted = checkRequestData?.content?.isShowAlert === true;

  const checkSubmitPayload = useMemo(() => ({
    bucketMasterId: bucketMasterId || '',
    bucketProcessId: processId || '',
    process: typeProcess || '',
  }), [bucketMasterId, typeProcess]);

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

  const isProgressNotCompleted = stepper.progress < MAX_STEP_PERCENTAGE;

  const isSubmitDisabled =
    !isSubmitAllowedByCheck || isProgressNotCompleted ||
    ((!pathname.includes('/analyst')) && !isDocumentConfirmed) ||
    (isAnalyst && additionalInformationDetail?.isMUPConfirmed === null);

  const isSubmitButtonDisabled = useMemo(() => {
    if (isDepiDivision) return isProgressNotCompleted;
    return isSubmitDisabled || (!isAnalyst && isCheckRequestAlerted);
  }, [isDepiDivision, isProgressNotCompleted, isSubmitDisabled, isAnalyst, isCheckRequestAlerted]);


  const handleButtonClose = () => {
    router.replace(listPagePathByCurrentProcess);
    setAct('');
  };

  useEffect(() => {
    if (isSynfunsionDisabled) setViewOnly(true);
  }, [isSynfunsionDisabled]);

  const { isPending: isSaveLoading, mutate: saveAdditionalInformation } = useSaveAdditionalInformation({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
    },
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['mip-additional-information', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      // Show modal
      showNiceModalV2({
        onClose: () => {
          if (isApdb) goToNextStep();
        },
        title: titleHeader + ' berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: submitBucket } = useSubmitBucket(
    {
      onError: (error) => {
        showNiceModalV2({ title: error?.message, type: 'error' });
      },
      onSuccess: () => {
        const title = act?.length > 0 ? listTitleModalSubmitBucket?.find((item) => item?.action === act)?.title : 'Data berhasil disimpan';

        closeNiceModal(MODAL.GLOBAL.COMMENT);

        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        showNiceModalV2({ onClose: () => handleButtonClose(), title, type: 'success' });
      },
    }
  );

  const hasForwardSubmitHighRisk = actions?.hasOwnProperty(FORWARD_SUBMIT_HIGH_RISK);

  const generateRadioOptions = () => {
    if (isRM) {
      return [
        {
          label: hasForwardSubmitHighRisk ? 'DK' : 'DPOP',
          value: hasForwardSubmitHighRisk ? FORWARD_TO_DK : FORWARD_TO_DPOP,
        },
        {
          label: 'TL',
          value: SUBMIT,
        },
      ];
    } else if (isTL) {
      return [
        {
          label: hasForwardSubmitHighRisk ? 'DK' : 'DPOP',
          value: hasForwardSubmitHighRisk ? FORWARD_TO_DK : FORWARD_TO_DPOP,
        },
        {
          label: 'KADIV',
          value: SUBMIT,
        },
      ];
    } else if (isMaker) {
      return [
        {
          label: hasForwardSubmitHighRisk ? 'DK' : 'DPOP',
          value: hasForwardSubmitHighRisk ? FORWARD_TO_DK : FORWARD_TO_DPOP,
        },
        {
          label: 'Checker',
          value: SUBMIT,
        },
      ];
    }
  };

  useEffect(() => {
    if (additionalInformationDetail) {
      setDisclaimer(additionalInformationDetail?.disclaimer);
      setIsDocumentConfirmed(additionalInformationDetail?.isMUPConfirmed);
      setIsWordEditorEmpty({
        additionalWord: additionalInformationDetail?.description ? false : true,
      });
      console.log('IsWordEditorEmpty', isWordEditorEmpty);
    }
  }, [additionalInformationDetail]);


  const handleOnDecline = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      isRadioMandatory: true,
      onSave: ({ comment, radioValue }) => {
        setAct(radioValue);
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.ANNUAL_REVIEW,
            process: typeProcess,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Declined',
      radioOptions: [
        { label: 'Canceled', value: CANCELED },
        { label: 'Rejected', value: REJECTED },
      ],
    });
  };

  const handleSaveAdditionalInfo = async () => {
    const blob = await convertToDocx(container);
    if (!isAnalyst && isWordEditorEmpty.additionalWord) {
      showNiceModalV2({ title: titleHeader + ' tidak boleh kosong', type: 'error' });
      return;
    } else {
      if (viewOnly) {
        goToNextStep();
      } else {
        saveAdditionalInformation({
          bucketProcessId: String(processId),
          description: blob,
          disclaimer: disclaimer,
          isMUPConfirmed: isDocumentConfirmed,
          module: TypeModule.ANNUAL_REVIEW,
          process: typeProcess,
        });
      }
    }
  };

  const handleSubmit = (action: string) => {
    let isCompleteEditAskForInfo = false;
    if (isWaitingAskForInfoKadiv && !isDepiDivision && isKadiv && action === SUBMIT) isCompleteEditAskForInfo = true;

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        const payload: any = {
          action,
          bucketProcessId: processId,
          comment,
          isCompleteEditAskForInfo,
          module: TypeModule.ANNUAL_REVIEW,
          process: typeProcess,
        };

        if (action === APPROVE && isKadiv) {
          payload.debtorName = `${bucketData?.institutionTypeLabel || ''} ${bucketData?.debtorName || ''}`.trim();
          payload.isPemda = isPemda;
        }

        submitBucket({
          submitRequestDto: payload,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleSubmitAskForInfo = () => {
    let isCompleteEditAskForInfo = false;
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        if (isAskforInfoKadiv) isCompleteEditAskForInfo = true;
        const payload = {
          action: isKadiv ? 'ASK_FOR_INFO' : radioValue,
          bucketProcessId: processId,
          comment,
          isCompleteEditAskForInfo,
          module: TypeModule.ANNUAL_REVIEW,
          process: typeProcess,
        };

        submitBucket({
          submitRequestDto: payload,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: generateRadioOptions(),
    });
  };


  const generateRadioNormal = () => {

    if (isRM && isDepiDivision) {
      return [
        { label: 'Bisnis', value: 'ASK_FOR_INFO' },
        { label: 'TL', value: 'ASK_FOR_INFO_TL' }
      ];
    } else if (isTL && isDepiDivision) {
      return [
        { label: 'Bisnis', value: 'ASK_FOR_INFO' },
        { label: 'Kadiv', value: 'SUBMIT_ASK_FOR_INFO' }
      ];
    }
  };

  const handleAskForInfo = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        let isCompleteEditAskForInfo = false;
        if (isAskforInfoKadiv) isCompleteEditAskForInfo = true;

        const resolvedAction = isKadiv ? 'ASK_FOR_INFO' : radioValue === 'SUBMIT_ASK_FOR_INFO' ? 'ASK_FOR_INFO_KADIV' : radioValue;

        submitBucket({
          submitRequestDto: {
            action: resolvedAction,
            bucketProcessId: processId,
            comment,
            module: TypeModule.ANNUAL_REVIEW,
            process: typeProcess,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      ...(!isKadiv ? {
        radioLabel: 'Forward to:',
        radioOptions: generateRadioNormal(),
      } : {}),
    });
  };

  const autoSavePayload = useMemo(() => async () => {
    const blob = await convertToDocx(container);

    return {
      bucketProcessId: String(processId),
      description: blob,
      disclaimer: disclaimer,
      isMUPConfirmed: isDocumentConfirmed,
      module: TypeModule.ANNUAL_REVIEW,
      process: typeProcess,
    };
  }, [container, processId, disclaimer, isDocumentConfirmed, typeProcess]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!processId,
    payload: autoSavePayload,
    url: 'mip.additionalInformation.save',
  });

  const renderActionButtons = () => {
    if (JSON.stringify(actions) === '{}') {
      return null;
    }

    let buttonContents = [];
    if (viewOnly && currentBucketStatus !== 'ASK_FOR_INFO') {
      buttonContents.push('NEXT');
    } else {
      buttonContents.push('SAVE_NEXT');
    }

    for (const key in actions) {
      if (buttonListTemplateByKey.includes(key)) {
        const indexByKeyInTemplate = buttonListTemplateByKey.indexOf(key);
        buttonContents[indexByKeyInTemplate] = [key, actions[key]];
      }
    }
    const buttonlist = buttonContents.map((button) => {
      const [key, value] = button;

      switch (key) {
        case CLOSE:
          return (
            <Button
              variant="outlined"
              color="error"
              onClick={handleButtonClose}
            >
              Close
            </Button>
          );
        case RETURN_TO_STAFF:
          return (
            <Button
              color="darkBlue"
              disabled={isProgressNotCompleted}
              onClick={() => handleSubmit(value)}
            >
              Return to Staff
            </Button>
          );
        case RETURN_TO_TL:
          return (
            <Button
              color="info"
              disabled={isProgressNotCompleted}
              onClick={() => handleSubmit(value)}
            >
              Return to TL
            </Button>
          );
        case RETURN_TO_ANALYST:
          return (
            <Button
              color="info"
              disabled={isProgressNotCompleted}
              onClick={() => handleSubmit(value)}
            >
              Return to Analyst
            </Button>
          );
        case APPROVE:
          return (
            <Button
              color="success"
              disabled={isProgressNotCompleted}
              onClick={() => handleSubmit(value)}
            >
              Approve
            </Button>
          );
        case SUBMIT:
          return (
            <Button
              color="success"
              disabled={isSubmitButtonDisabled}
              onClick={() => handleSubmit(value)}
            >
              {(isRM || isTL || isAnalyst || isMaker) ? 'Submit' : 'Approve'}
            </Button>
          );
        case ASK_FOR_INFO:
          return (
            <Button
              color="lightYellow"
              disabled={isProgressNotCompleted}
              onClick={handleAskForInfo}
            >
              Ask For Info
            </Button>
          );
        case COMPLETE:
          return (
            <Button
              color="success"
              disabled={isDepiDivision ? isProgressNotCompleted : isSubmitDisabled}
              onClick={() => handleSubmit(value)}
            >
              Submit
            </Button>
          );
        case 'FORWARD_SUBMIT':
          return (
            <Button
              color="success"
              disabled={isProgressNotCompleted}
              onClick={handleSubmitAskForInfo}
            >
              {(isRM || isTL || isMaker) ? 'Submit' : 'Approve'}
            </Button>
          );
        case 'FORWARD_SUBMIT_HIGH_RISK':
          return (
            <Button
              color="success"
              disabled={isProgressNotCompleted}
              onClick={() => {
                isKadiv ? handleSubmit('SUBMIT') : handleSubmitAskForInfo();
              }}
            >
              Submit
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
        case SAVE:
          return (
            <Button
              onClick={handleSaveAdditionalInfo}
              isLoading={false}
              disabled={isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Saving...' : (isApdb ? 'Save & Next' : 'Save')}

            </Button>
          );
        case 'NEXT':
          return (
            <Button onClick={() => console.log('next')}>
              Next
            </Button>
          );

        case APPROVE_ASK_FOR_INFO:
          return (
            <Button
              color="lightYellow"
              onClick={() => handleSubmit('SUBMIT')}
            >
              Approve Ask For Info
            </Button>
          );
        case 'SAVE_NEXT':
          return (
            <Button
              onClick={handleSaveAdditionalInfo}
              isLoading={false}
            >
              {isApdb ? 'Save & Next' : 'Save'}

            </Button>
          );
        case 'CANCELED':
          return (
            <Button
              variant="outlined"
              onClick={handleOnDecline}
            >
              Canceled
            </Button>
          );
        default:
          break;
      }
    });

    return buttonlist;
  };


  return {
    additionalInformationDetail,
    container,
    disclaimer,
    handleSaveAdditionalInfo,
    handleSubmitAskForInfo,
    isAnalyst,
    isAnnualReviewAnalyst,
    isAnnualReviewBisnis,
    isBusinessDivision,
    isDepiDivision,
    isDocumentConfirmed,
    isHistoryRating,
    isLoading,
    isPreview,
    isSaveLoading,
    isSynfunsionDisabled,
    isWordEditorEmpty,
    renderActionButtons,
    setContainer,
    setDisclaimer,
    setIsDocumentConfirmed,
    setIsWordEditorEmpty,
    titleHeader,
    typeProcess,
    viewOnly,
  };
};
