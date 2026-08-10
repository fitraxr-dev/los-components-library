import { useContext, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';


import {
  DECLINE,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  roles,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import Button from '@/components/shared/Button';

import useGetDetailAdditionalInfo from './hooks/useGetDetailAdditionalInfo';
import useSaveAdditionalInfo from './hooks/useSaveAdditionalInfo';
import useSubmitAdditionalInformation from './hooks/useSubmitAdditionalInformation';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';


export const useAdditionalInformation = () => {
  const router = useCustomRouter();
  const [user] = useApp();
  const pathname = usePathname();
  const { actionButtons } = useMUPContext();
  const { setDirtyMsg } = useContext(DirtyContext);

  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const isRm = user.currentRole.includes(roles.RM);
  const isTL = user.currentRole.includes(roles.TL) || user.currentRole.includes(roles.TL_ANALYST);
  const isKadiv = user.currentRole.includes(roles.KADIV);
  const goToNextStep = useGoToNextStep();
  const [container, setContainer] = useState(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    additional: true,
  });

  const buttonListTemplateByKey = [DECLINE, RETURN_TO_STAFF, RETURN_TO_TL, SUBMIT];
  const listPagePathname = pathname.split('/').splice(0, 3).join('/');

  const { data: additionalInfoDetail, isLoading: isDetailLoading } = useGetDetailAdditionalInfo({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const { mutate: saveAdditionalInfo, isPending: isSubmitting } = useSaveAdditionalInfo ({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose: handleNextStep,
        title: 'Additional information berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: submit, isPending: isSubmitLoading } = useSubmitAdditionalInformation({
    onError: (_, data) => {
      switch (data.action) {
        case SUBMIT:
          showNiceModalV2({
            title: isKadiv ? 'MUP Approved gagal' : `MUP gagal dikirim untuk approval ${isRm ? 'TL' : ''} ${isTL ? 'Kadiv' : ''}`,
            type: 'error',
          });
          return;
        default:
          return;
      }
    },
    onSuccess: (_, data: SubmitRequestDto) => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      switch (data.action) {
        case SUBMIT:
          showNiceModalV2({
            title: isKadiv ? 'MUP Approved' : `MUP berhasil dikirim untuk approval ${isRm ? 'TL' : ''} ${isTL ? 'Kadiv' : ''}`,
            type: 'success',
          });

          setTimeout(() => {
            closeNiceModal(MODAL.GLOBAL.SUCCESS);
            router.push(listPagePathname);
          }, 1000);
          break;
        default:
          return;
      }
    },
  });

  const handleNextStep = () => {
    if (actionButtons === null || actionButtons === undefined) return goToNextStep();
  };


  const handleOpenSubmitModal = ({ action }: {action: string}) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submit({
          action,
          bucketProcessId: processId,
          comment,
          module: TypeModule.MUP,
          process: TypeProcess.MUP,
        });
      },
    });
  };
  const handleOpenDeclineModal = () => {
    NiceModal.show(MODAL.DECLINE);
  };

  const handleSave = async () => {
    const description = await convertToDocx(container);
    if (!viewOnly) {
      saveAdditionalInfo({
        bucketProcessId: processId,
        description: description,
        disclaimer: additionalInfoDetail.disclaimer,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      });
    } else {
      goToNextStep();
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
        case RETURN_TO_STAFF:
          return (
            <Button
              color="darkBlue"
              disabled={isSubmitting || isSubmitLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleOpenSubmitModal({ action: value })}
            >
              Return to Staff
            </Button>
          );
        case RETURN_TO_TL:
          return (
            <Button
              color="info"
              disabled={isSubmitting || isSubmitLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleOpenSubmitModal({ action: value })}
            >
              Return to TL
            </Button>
          );
        case SUBMIT:
          return (
            <Button
              color="success"
              disabled={isSubmitting || isDetailLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleOpenSubmitModal({ action: value })}
            >
              {isRm ? 'Submit' : 'Approve'}
            </Button>
          );
        case DECLINE:
          return (
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpenDeclineModal}
              disabled={isSubmitting || isDetailLoading}
            >
              Decline
            </Button>
          );
        default:
          return null;
      }
    });

    return buttonlist;
  };


  return {
    additionalInfoDetail,
    container,
    handleOpenDeclineModal,
    handleSave,
    isDetailLoading,
    isSubmitting,
    isWordEditorEmpty,
    renderActionButtons,
    setContainer,
    setIsWordEditorEmpty,
    viewOnly,
  };
};
