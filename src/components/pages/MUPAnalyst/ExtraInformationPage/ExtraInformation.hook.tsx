import { useContext, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import { RETURN_TO_STAFF, RETURN_TO_TL, roles, SUBMIT } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';
import Button from '@/components/shared/Button';

import useGetDetailExtraInformation from './hooks/useGetDetailExtraInformation';
import useSaveExtraInformation from './hooks/useSaveExtraInformation';
import useSubmitExtraInformation from './hooks/useSubmitExtraInformation';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';


export const useExtraInformation = () => {
  const [user] = useApp();
  const { actionButtons } = useMUPAnalystContext();
  const { processId } = useIdentity();
  const queryClient = useQueryClient();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [descriptionContainer, setDescriptionContainer] = useState(null);

  const isRm = user.currentRole.includes(roles.RM);
  const isTL = user.currentRole.includes(roles.TL) || user.currentRole.includes(roles.TL_ANALYST);
  const isKadiv = user.currentRole.includes(roles.KADIV);

  const buttonListTemplateByKey = [RETURN_TO_STAFF, RETURN_TO_TL, SUBMIT];

  const { mutate: submit, isPending: isSubmitLoading } = useSubmitExtraInformation({
    onError: (_, data) => {
      switch (data.action) {
        case RETURN_TO_STAFF:
          showNiceModalV2({
            title: 'MUP gagal Return to Staff',
            type: 'error',
          });
          return;
        case RETURN_TO_TL:
          showNiceModalV2({
            title: 'MUP gagal Return to TL',
            type: 'error',
          });
          return;
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
        case RETURN_TO_STAFF:
          showNiceModalV2({
            title: 'MUP berhasil Return to Staff',
            type: 'success',
          });
          return;
        case RETURN_TO_TL:
          showNiceModalV2({
            title: 'MUP berhasil Return to TL',
            type: 'success',
          });
          return;
        case SUBMIT:
          showNiceModalV2({
            title: isKadiv ? 'MUP Approved' : `MUP berhasil dikirim untuk approval ${isRm ? 'TL' : ''} ${isTL ? 'Kadiv' : ''}`,
            type: 'success',
          });
          return;
        default:
          return;
      }
    },
  });

  const { mutate: saveExtraInformation, isPending: isSaveLoading } = useSaveExtraInformation({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
        bucketProcessId: processId,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      }]});
    },
  });

  const { data: detailExtraInformation, isLoading: isDetailLoading } = useGetDetailExtraInformation({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const handleOpenDeclineModal = () => {
    NiceModal.show(MODAL.DECLINE);
  };

  const handleSave = async () => {
    const description = await convertToDocx(descriptionContainer);

    saveExtraInformation({
      bucketProcessId: processId,
      description,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    });
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
              color="secondary"
              disabled={isSaveLoading || isSubmitLoading}
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
              disabled={isSaveLoading || isSubmitLoading}
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
              disabled={isSaveLoading || isDetailLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleOpenSubmitModal({ action: value })}
            >
              {isRm ? 'Submit' : 'Approve'}
            </Button>
          );
        default:
          return null;
      }
    });

    return buttonlist;
  };

  return {
    descriptionContainer,
    detailExtraInformation,
    handleOpenDeclineModal,
    handleOpenSubmitModal,
    handleSave,
    isDetailLoading,
    isSaveLoading,
    isSubmitLoading,
    renderActionButtons,
    setDescriptionContainer,
  };
};
