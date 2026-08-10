import { useContext, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';


import {
  ASK_FOR_INFO,
  CANCELED,
  DECLINE,
  REJECTED,
  RETURN_TO_MAKER,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  SAVE,
  SUBMIT,
  SUBMIT_ASK_FOR_INFO,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
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
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useHighRiskContext } from '@/components/layouts/HighRiskLayout/HighRisk.context';
import Button from '@/components/shared/Button';

import { useConclusionContext } from '../../Conclusion.context';

import useGetDetailAdditionalInformation from './hooks/useGetDetailAdditionalInformation';
import useSaveAdditionalInformation from './hooks/useSaveAdditionalInformation';


const useAdditionalInformation = () => {
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const [container, setContainer] = useState(null);
  const { currentListPage } = useHighRiskContext();
  const { actionButtons, isRm, isMaker, isCurrentStepDone, isKadiv } = useConclusionContext();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [{ stepper }] = useApp();
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();


  const { data: dataDetail, isLoading: isDetailLoading } = useGetDetailAdditionalInformation({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const { data: bucketData } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const { data: validateResult } = useGetValidateResult({
    debtorId: bucketData?.debtorId,
  }, {
    enabled: !!bucketData?.debtorId,
  });


  const isCompletedStepper = stepper?.progress === 100;
  const isSubmitEnable = validateResult?.content?.isSubmitButtonEnable && isCompletedStepper;

  const { mutate: saveAdditionalInformation } = useSaveAdditionalInformation({
    onError: () => {
      setDirtyMsg(undefined);
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
    },
  });

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      closeNiceModal(MODAL.DECLINE);
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS).then(() => {
            queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
            router.push(currentListPage);
          });
        },
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });

  const radioOptionRm = [
    { label: 'Bisnis', value: ASK_FOR_INFO },
    { label: 'TL', value: SUBMIT_ASK_FOR_INFO }
  ];

  const radioOptionTl = [
    { label: 'Bisnis', value: ASK_FOR_INFO },
    { label: 'Kadiv', value: SUBMIT_ASK_FOR_INFO }
  ];

  const handleOnSubmit = ({ action, process }: { action: string; process: string }) => {
    switch (action) {
      case 'DECLINE':
        NiceModal.show(MODAL.DECLINE, {
          isLoading: isSubmitLoading,
          onSave: ({ comment, radioValue }) => {
            submitBucket({
              submitRequestDto: {
                action: radioValue ?? ASK_FOR_INFO,
                bucketProcessId: processId,
                comment,
                module: TypeModule.HIGH_RISK,
                process: TypeProcess.HIGH_RISK_DK,
              },
            });
          },
        });
        break;
      case 'ASK_FOR_INFO':
        if (isKadiv) {
          NiceModal.show(MODAL.GLOBAL.COMMENT, {
            isLoading: isSubmitLoading,
            onSave: ({ comment }) => {
              submitBucket({
                submitRequestDto: {
                  action: ASK_FOR_INFO,
                  bucketProcessId: processId,
                  comment,
                  module: TypeModule.HIGH_RISK,
                  process: TypeProcess.HIGH_RISK_DK,
                },
              });
            },
          });
        } else if (isRm || isMaker) {
          NiceModal.show(MODAL.GLOBAL.COMMENT, {
            isLoading: isSubmitLoading,
            onSave: ({ comment, radioValue }) => {
              submitBucket({
                submitRequestDto: {
                  action: radioValue,
                  bucketProcessId: processId,
                  comment,
                  module: TypeModule.HIGH_RISK,
                  process: TypeProcess.HIGH_RISK_DK,
                },
              });
            },
            radioLabel: 'Forward to',
            radioOptions: radioOptionRm,
          });
        } else {
          NiceModal.show(MODAL.GLOBAL.COMMENT, {
            isLoading: isSubmitLoading,
            onSave: ({ comment }) => {
              submitBucket({
                submitRequestDto: {
                  action: ASK_FOR_INFO,
                  bucketProcessId: processId,
                  comment,
                  module: TypeModule.HIGH_RISK,
                  process: TypeProcess.HIGH_RISK_DK,
                },
              });
            },
          });
        }
        break;
      default:
        NiceModal.show(MODAL.GLOBAL.COMMENT, {
          isLoading: isSubmitLoading,
          onSave: ({ comment }) => {
            submitBucket({
              submitRequestDto: {
                action,
                bucketProcessId: processId,
                comment,
                module: TypeModule.HIGH_RISK,
                process,
              },
            });
          },
        });
        break;
    }
  };

  const handleOnSave = async () => {
    const description = await convertToDocx(container);

    saveAdditionalInformation({
      bucketProcessId: processId,
      description,
      disclaimer: null,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    });
  };

  const autoSavePayload = useMemo(() => async () => {

    const descriptionBlob = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description: descriptionBlob,
      disclaimer: null,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    };
  }, [container, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!dataDetail && !!processId,
    payload: autoSavePayload,
    url: 'mip.additionalInformation.save',
  });

  const buttonsTemplateByKey = [DECLINE, SAVE, RETURN_TO_STAFF, RETURN_TO_TL, RETURN_TO_MAKER, ASK_FOR_INFO, SUBMIT];

  const renderActionButtons = () => {
    if (!actionButtons || Object.keys(actionButtons).length === 0) {
      return [];
    }

    let buttonContents = [];

    for (const key in actionButtons) {
      if (buttonsTemplateByKey.includes(key)) {
        const keyIndex = buttonsTemplateByKey.indexOf(key);
        buttonContents[keyIndex] = [key, actionButtons[key]];
      }
    }

    const buttonList = buttonContents.map((button) => {
      const [key, value] = button;

      switch (key) {
        case 'DECLINE':
          return (
            <Button
              color="error"
              variant="outlined"
              onClick={() => handleOnSubmit({ action: value, process: TypeProcess.HIGH_RISK_DK })}
            >
              Decline
            </Button>
          );
        case 'SAVE':
          return (
            <Button
              onClick={handleOnSave}
              disabled={isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
          );
        case 'RETURN_TO_STAFF':
          return (
            <Button
              color="darkBlue"
              onClick={() => handleOnSubmit({ action: value, process: TypeProcess.HIGH_RISK_DK })}
            >
              Return to Staff
            </Button>
          );
        case 'RETURN_TO_TL':
          return (
            <Button
              color="info"
              onClick={() => handleOnSubmit({ action: value, process: TypeProcess.HIGH_RISK_DK })}
            >
              Return to TL
            </Button>
          );
        case 'RETURN_TO_MAKER':
          return (
            <Button
              color="info"
              onClick={() => handleOnSubmit({ action: value, process: TypeProcess.HIGH_RISK_DK })}
            >
              Return to Maker
            </Button>
          );
        case 'ASK_FOR_INFO':
          return (
            <Button
              color="lightYellow"
              onClick={() => handleOnSubmit({ action: value, process: TypeProcess.HIGH_RISK_DK })}
            >
              {isRm || isMaker ? 'Ask For Info' : 'Approve Ask For Info'}
            </Button>
          );
        case 'SUBMIT':
          return (
            <Button
              disabled={!(isSubmitEnable && isCurrentStepDone)}
              color="success"
              onClick={() => handleOnSubmit({ action: value, process: TypeProcess.HIGH_RISK_DK })}
            >
              {isKadiv ? 'Approve' : 'Submit'}
            </Button>
          );
        default:
          break;
      }
    });

    return buttonList;
  };

  return {
    container,
    dataDetail,
    handleOnSave,
    isDetailLoading,
    renderActionButtons,
    setContainer,
  };
};

export default useAdditionalInformation;
