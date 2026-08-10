import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';


import { SUBMIT, RETURN_TO_ANALYST, APPROVE, COMPLETE } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { TypeRoles } from '@/enums/Roles';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';
import Button from '@/components/shared/Button';

import useGetDetailFinancialSummary from './hooks/useGetDetailFinancialSummary';
import useSaveFinancialSummary from './hooks/useSaveFinancialSummary';


export const useFinancialSummary = () => {
  const [container, setContainer] = useState(null);
  const goToNextStep = useGoToNextStep();
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const { actionButtons } = useMUPAnalystContext();

  const { processId } = useIdentity();
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const [state] = useApp();
  const currentRole = state.currentRole;
  const isTl = currentRole.includes(TypeRoles.TL);

  const buttonListTemplateByKey = [SUBMIT, RETURN_TO_ANALYST, APPROVE, COMPLETE];


  const { data: financingDetail } = useGetDetailFinancialSummary({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP_ANALYST,
  });

  const { mutate: saveFinancingSummary, isPending: isSubmitting } = useSaveFinancialSummary({
    onSuccess: () => {
      showNiceModalV2({ type: 'success' });
    },
  });

  const handleSave = (blob: Blob) => {
    saveFinancingSummary({
      bucketProcessId: processId,
      description: blob,
      module: TypeModule.MUP,
      process: TypeProcess.MUP_ANALYST,
    });
  };

  const { isSuccess: submitBucketIsSuccess, mutate: submitBucket } = useSubmitBucket(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        showNiceModalV2({ onClose: () => {
          router.push('/loan-processing/mup-analyst');
        }, title: 'Data berhasil di simpan', type: 'success' });
      },
    }
  );

  const onSubmit = (
    { action, showComment = true }: { action: string; showComment?: boolean}
  ) => {
    if (showComment) {
      NiceModal.show(
        MODAL.GLOBAL.COMMENT,
        {
          onSave: ({ comment }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);
            submitBucket({
              submitRequestDto: {
                action: action,
                bucketProcessId: processId,
                comment: comment,
                module: TypeModule.MUP,
                process: TypeProcess.MUP_ANALYST,
              },
            }, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
              },
            });
          },
        },
      );
    }

  };

  const renderActionButtons = () => {
    if (JSON.stringify(actionButtons) === '{}') {
      return null;
    }

    let buttonContents = [];

    for (const key in actionButtons) {
      if (buttonListTemplateByKey.includes(key)) {
        const indexByKeyInTemplate = buttonListTemplateByKey.indexOf(key);
        buttonContents[indexByKeyInTemplate] = [key, actionButtons[key]];
      }
    }

    const buttonlist = buttonContents.map((button) => {
      const [key, value] = button;

      switch (key) {
        case SUBMIT:
          return (
            <Button
              isLoading={isSubmitting}
              onClick={() => {
                onSubmit({ action: SUBMIT });
              }}
              color="success"
            >
              Submit
            </Button>
          );
        case RETURN_TO_ANALYST:
          return (
            <Button
              isLoading={isSubmitting}
              onClick={() => {
                onSubmit({ action: RETURN_TO_ANALYST });
              }}
              color="info"
            >
              Return to Analyst
            </Button>
          );
        case APPROVE:
          return (
            <Button
              isLoading={isSubmitting}
              onClick={() => {
                onSubmit({ action: APPROVE });
              }}
              color="success"
            >
              Approve
            </Button>
          );
        case COMPLETE:
          return (
            <Button
              isLoading={isSubmitting}
              onClick={() => {
                onSubmit({ action: COMPLETE });
              }}
              color="success"
            >
              {!isTl ? 'Submit' : 'Approve'}
            </Button>
          );
        default:
          return null;
      }
    });

    return buttonlist;
  };

  return {
    container,
    financingDetail,
    handleSave,
    isSubmitting,
    renderActionButtons,
    setContainer,
    setShouldGoNext,
  };
};
