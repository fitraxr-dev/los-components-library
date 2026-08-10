import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import {
  ASK_FOR_INFO,
  CANCELED,
  CLOSE,
  DECLINE,
  MAX_STEP_PERCENTAGE,
  REJECTED,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  SAVE,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';
import Button from '@/components/shared/Button';

import {
  FORWARD_SUBMIT_HIGH_RISK,
  FORWARD_TO_DK,
  FORWARD_TO_DPOP,
  listTitleModalSubmitBucket,
} from '../CustomerDueDiligencePage/CustomerDueDiligance.constants';

import useGetAdditionalInformationById from './hooks/useGetAdditionalInformationById';
import useSaveAdditionalInformation from './hooks/useSaveAdditionalInformation';


export const useAdditionalInformation = () => {
  const { processId }: { processId: string } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [container, setContainer] = useState(null);
  const [act, setAct] = useState('');
  const { viewOnly, setViewOnly } = useViewOnly();
  const path = usePathname();
  const { process } = useApuPpt();
  const [{ stepper }] = useApp();
  const currentBucketStatus = stepper.from;
  const [submitPayload, setSubmitPayload] = useState(null);
  const [savePayload, setSavePayload] = useState(null);
  const { recordActivity } = useRecordLog();

  const [isNextStep, setIsNextStep] = useState(false);
  const { isRM, isTL, isKadiv, goToNextStep, actions, isDpopDivision, isBusinessDivision } = useApuPptContext();
  const currentProcess = path.split('/')[3];
  const listPagePathByCurrentProcess = `/loan-processing/apu-ppt/${currentProcess}`;
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const buttonListTemplateByKey = [CLOSE, DECLINE, SAVE, RETURN_TO_STAFF, RETURN_TO_TL, SUBMIT, 'FORWARD_SUBMIT', 'FORWARD_SUBMIT_HIGH_RISK', 'SAVE_NEXT', 'NEXT'];
  const isApdb = useMemo(() => {
    const bucketApdb = processId?.split('-')[0] === 'APDP';
    return bucketApdb;
  }, [processId]);

  const isAskforInfoKadiv = useMemo(() => {
    let askForInfoKadiv = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('COMPLETED_ASK_FOR_INFO')) {
      askForInfoKadiv = true;
    }
    return askForInfoKadiv;
  }, [actions]);

  const isSynfunsionDisabled = useMemo(() => {
    let disabled = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('VIEW_ONLY')) {
      disabled = true;
    }
    return disabled;
  }, [actions]);
  const submitDisabled = stepper.progress < MAX_STEP_PERCENTAGE;
  const handleButtonClose = () => {
    router.replace(listPagePathByCurrentProcess);
    setAct('');
  };

  const isStaffDpop = isRM && isDpopDivision;
  const isTLDpop = isTL && isDpopDivision;
  const isDpop = process === TypeProcess.APU_PPT_DPOP;

  useEffect(() => {
    if (isSynfunsionDisabled) setViewOnly(true);
  }, [isSynfunsionDisabled]);

  const autoSavePayload = useMemo(() => async () => {
    if (!container) return null;

    const blob = await convertToDocx(container);

    return {
      bucketProcessId: String(processId),
      description: blob,
      module: TypeModule.APU_PPT,
      process,
    };
  }, [container, processId, process]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly && !!container,
    payload: autoSavePayload,
    url: 'mip.apuppt.saveAdditional',
  });

  const mapActionToActivityType = (action: string): ActivityType => {
    switch (action) {
      case 'SUBMIT':
        return (isRM || isTL) ? ActivityType.SUBMIT : ActivityType.APPROVE;
      case 'REJECTED':
        return ActivityType.REJECT;
      case 'CANCELED':
        return ActivityType.CANCEL;
      case 'RETURN_TO_STAFF':
        return ActivityType.RETURN_TO_STAFF;
      case 'RETURN_TO_TL':
        return ActivityType.RETURN_TO_TL;
      case 'ASK_FOR_INFO':
        return ActivityType.ASK_FOR_INFO;
      case 'DECLINE':
        return ActivityType.DECLINE;
      default:
        return ActivityType.SUBMIT;
    }
  };


  const { isPending: isSaveLoading, mutate: saveAdditionalInformation } = useSaveAdditionalInformation({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: String(processId),
        changeAfter: JSON.stringify({ ...savePayload, description: '[FILE_DOCX]' }),
        changeBefore: additionalInformationDetail ? JSON.stringify({ ...additionalInformationDetail, description: '[FILE_DOCX]' }) : null,
        module: TypeModule.APU_PPT,
        process,
        remarks: additionalInformationDetail ? 'Update Additional Information Document' : 'Add Additional Information Document',
      });
      // Reset dirty state
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['mip-additional-information', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      // Show modal
      showNiceModalV2({
        onClose: () => {
          if (isNextStep) goToNextStep();
        },
        title: 'Additional information berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: submitBucket } = useSubmitBucket(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        const activity = mapActionToActivityType(submitPayload?.action);

        recordActivity({
          activity: activity,
          bucketProcessId: String(processId),
          changeAfter: JSON.stringify(submitPayload),
          changeBefore: '',
          module: TypeModule.APU_PPT,
          process,
          remarks: `User performed ${activity} with action: ${submitPayload?.action} on Additional Information`,
        });
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
    } else {
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
    }
  };
  const {
    data: additionalInformationDetail,
    isFetching: isFetchLoading,
    isLoading,
  } = useGetAdditionalInformationById({
    bucketProcessId: String(processId),
    module: TypeModule.APU_PPT,
    process,
  });

  const { data: bucketData } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process,
  });

  const { data: validateResult } = useGetValidateResult({
    debtorId: bucketData?.debtorId,
  }, {
    enabled: !!bucketData?.debtorId,
  });

  const isCompletedStepper = stepper?.progress === MAX_STEP_PERCENTAGE;
  const isSubmitedEnable = validateResult?.content?.isSubmitButtonEnable && isCompletedStepper;


  const handleOnDecline = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      isRadioMandatory: true,
      onSave: ({ comment, radioValue }) => {
        setAct(radioValue);
        setSubmitPayload({
          action: radioValue,
          bucketProcessId: processId,
          comment,
          module: TypeModule.APU_PPT,
          process,
        });
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.APU_PPT,
            process,
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
    if (viewOnly) {
      goToNextStep();
    } else {
      setSavePayload({ bucketProcessId: String(processId),
        description: blob,
        module: TypeModule.APU_PPT,
        process });
      saveAdditionalInformation({
        bucketProcessId: String(processId),
        description: blob,
        module: TypeModule.APU_PPT,
        process,
      });
    }
  };

  const handleSubmit = (action: string) => {
    let isCompleteEditAskForInfo = false;
    if (isAskforInfoKadiv && isBusinessDivision && isKadiv && action === 'SUBMIT') isCompleteEditAskForInfo = true;
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        const payload = {
          action,
          bucketProcessId: processId,
          comment,
          isCompleteEditAskForInfo,
          module: TypeModule.APU_PPT,
          process: TypeProcess.APU_PPT,
        };
        submitBucket({
          submitRequestDto: payload,
        });
        setSubmitPayload(payload);
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
          module: TypeModule.APU_PPT,
          process: TypeProcess.APU_PPT,
        };
        setSubmitPayload(payload);
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

    if (isStaffDpop) {
      return [
        { label: 'Bisnis', value: 'ASK_FOR_INFO' },
        { label: 'TL', value: 'SUBMIT_ASK_FOR_INFO' }
      ];
    } else if (isTLDpop) {
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

        submitBucket({
          submitRequestDto: {
            action: isKadiv ? 'ASK_FOR_INFO' : radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.APU_PPT,
            process: TypeProcess.APU_PPT_DPOP,
          },
        });
        setSubmitPayload({
          action: isKadiv ? 'ASK_FOR_INFO' : radioValue,
          bucketProcessId: processId,
          comment,
          module: TypeModule.APU_PPT,
          process: TypeProcess.APU_PPT_DPOP,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      ...(!isKadiv ? {
        radioLabel: 'Forward to:',
        radioOptions: generateRadioNormal(),
      } : {}),
    });
  };

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
              disabled={submitDisabled}
              onClick={() => handleSubmit(value)}
            >
              Return to Staff
            </Button>
          );
        case RETURN_TO_TL:
          return (
            <Button
              color="info"
              disabled={submitDisabled}
              onClick={() => handleSubmit(value)}
            >
              Return to TL
            </Button>
          );
        case SUBMIT:
          return (
            <Button
              color="success"
              disabled={!isSubmitedEnable}
              onClick={() => handleSubmit(value)}
            >
              {(isRM || isTL) ? 'Submit' : 'Approve'}
            </Button>
          );
        case 'FORWARD_SUBMIT':
          return (
            <Button
              color="success"
              disabled={!isSubmitedEnable}
              onClick={handleSubmitAskForInfo}
            >
              {isRM ? 'Submit' : 'Approve'}
            </Button>
          );
        case 'FORWARD_SUBMIT_HIGH_RISK':
          return (
            <Button
              color="success"
              disabled={!isSubmitedEnable}
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
              isLoading={isSaveLoading}
              disabled={isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Saving...' : (isApdb ? 'Save & Next' : 'Save')}
            </Button>
          );
        case 'NEXT':
          return (
            <Button onClick={goToNextStep}>
              Next
            </Button>
          );
        case ASK_FOR_INFO:
          return (
            <Button
              color="lightYellow"
              onClick={handleAskForInfo}
            >
              Ask For Info
            </Button>
          );
        case 'SAVE_NEXT':
          return (
            <>
              <Button
                onClick={handleSaveAdditionalInfo}
                isLoading={isSaveLoading}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsNextStep(true);
                  handleSaveAdditionalInfo();
                }}
                isLoading={isSaveLoading}
              >
                Next
              </Button>
            </>
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
    goToNextStep,
    handleSaveAdditionalInfo,
    handleSubmitAskForInfo,
    isDpop,
    isLoading,
    isSaveLoading,
    isSynfunsionDisabled,
    process,
    renderActionButtons,
    setContainer,
    viewOnly,
  };
};
