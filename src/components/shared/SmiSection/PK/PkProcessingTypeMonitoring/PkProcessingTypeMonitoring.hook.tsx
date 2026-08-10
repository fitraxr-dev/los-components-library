import React, { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { engagementSubmission } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { capitalize } from '@/helpers/string';
import useGetValidateResultDebtor from '@/hooks/services/useGetValidateResultDebtor';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';


import Button from '@/components/shared/Button';

import type { PkProcessingProps } from '../PK.types';
import type { SubmitRequestDto } from '@/services/openapi/processor-service';


interface ButtonProps {
  variant?: 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'darkBlue';
  text?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const usePkProcessingMonitoring = ({ module, process, isLegalSigning = false }: PkProcessingProps) => {
  const queryClient = useQueryClient();
  const path = usePathname();
  const theme = useTheme();
  const router = useCustomRouter();
  const { debtorId, processId } = useIdentity();
  const { setDirtyMsg } = useContext(DirtyContext);
  const lastPath = getLastPath(engagementSubmission.PK_PROCESSING_TYPE_MONITORING);
  const [actionButtons, setActionButtons] = useState({});
  const goToNextStep = useGoToNextStep();
  const [{ stepper }] = useApp();
  const isProgressComplete = stepper?.progress === 100;

  const { data: validateResult } = useGetValidateResultDebtor(
    {
      bucketProcessId: processId,
      debtorId,
      module: module,
      process: process,
    },
    { enabled: !!debtorId },
  );
  const isSubmitedDisabled = validateResult?.content?.isSubmitButtonEnable === false;
  const warningBoxMassage = validateResult?.content?.result;

  useEffect(() => {
    updateActionButtons();
  }, [stepper]);

  useEffect(() => {
    localStorage.removeItem('askForInfoEditPk');
  }, []);

  const updateActionButtons = () => {
    const btnAction = stepper.steps?.find((step) => step?.urlPath === lastPath && typeof step.action === 'object')?.action;
    const formattedActionButtons = { NEXT: 'NEXT' };
    if (btnAction) {
      for (const [key, value] of Object.entries(btnAction)) {
        if (key.includes('ASK_FOR_INFO')) {
          formattedActionButtons['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
        } else {
          formattedActionButtons[key] = value;
        }
      }
    }
    setActionButtons(formattedActionButtons);
  };


  const handleNext = () => {
    queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
    goToNextStep();
  };

  /*** Start API Call Setup */
  const { isSuccess: submitBucketIsSuccess, mutate: submitBucket } = useSubmitBucket(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        showNiceModalV2({
          onClose: () => {
            const pathUrl = engagementSubmission.LIST_PAGE;
            router.replace(pathUrl);
          }, title: 'Data berhasil di simpan', type: 'success',
        });
      },
    }
  );


  const handleButton = (key: string, value: string) => {
    const buttonProps: ButtonProps = {
      onClick: () => handleSubmit(value),
      text: key.toLowerCase()
        .replace(/_/g, ' ')
        .split(' ')
        .map((word, index) => {
          // Kata penghubung yang tidak perlu dikapitalisasi (kecuali di awal)
          const lowercaseWords = ['to', 'for'];
          // Singkatan yang harus kapitalisasi penuh
          const uppercaseWords = ['tl'];

          if (uppercaseWords.includes(word)) {
            return word.toUpperCase();
          }

          if (index > 0 && lowercaseWords.includes(word)) {
            return word;
          }

          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' '),
      variant: 'contained',
    };

    switch (key) {
      case 'SUBMIT':
      case 'APPROVE':
        buttonProps.color = 'success';
        buttonProps.disabled = !isProgressComplete || isSubmitedDisabled;
        break;
      case 'RETURN_TO_STAFF':
        buttonProps.color = 'darkBlue';
        break;
      case 'RETURN_TO_MAKER':
        buttonProps.color = 'darkBlue';
        break;
      case 'RETURN_TO_TL':
        buttonProps.color = 'info';
        break;
      case 'APPROVE_ASK_FOR_INFO':
        buttonProps.color = 'warning';
        break;
      case 'CANCELED':
        buttonProps.variant = 'outlined';
        buttonProps.color = 'error';
        buttonProps.onClick = handleDecline;
        buttonProps.text = 'Decline';
        break;
      case 'DECLINE':
        buttonProps.variant = 'outlined';
        buttonProps.color = 'error';
        buttonProps.onClick = handleDecline;
        buttonProps.text = 'Decline';
        break;
      case 'NEXT':
        buttonProps.onClick = handleNext;
        break;
      default:
        buttonProps.color = 'warning';
        buttonProps.onClick = handleAskForInfo;
    }

    return <Button key={key} {...buttonProps} sx={{ mr: 3 }}>{buttonProps.text.replace(/_/g, ' ')}</Button>;
  };


  const handleSubmit = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: module,
            process: process,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });

  };

  const handleAskForInfo = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: module,
            process: process,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: [
        { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
        { label: 'TL', value: 'ASK_FOR_INFO_TL' }
      ],
    });
  };

  const handleDecline = async () => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment, radioValue }) => {
          setDirtyMsg(undefined);
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: SubmitRequestDto = {
            action: radioValue,
            bucketProcessId: `${processId}`,
            comment,
            module: module,
            process: process,
          };

          submitBucket({ submitRequestDto: payload });
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Cancelled', value: 'CANCELED' },
          { label: 'Rejected', value: 'REJECTED' }
        ],
      },
    );
  };

  return {
    actionButtons,
    handleButton,
    handleDecline,
    isSubmitedDisabled,
    theme,
    warningBoxMassage,
  };
};

export default usePkProcessingMonitoring;
