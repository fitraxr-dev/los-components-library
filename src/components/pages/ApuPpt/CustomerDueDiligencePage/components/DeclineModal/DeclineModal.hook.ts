import { useState } from 'react';


import { MODAL } from '@/configs/constants/modalId';
import { apuPpt } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { CANCEL, CANCELED, REJECT } from './DeclineModal.constants';
import useDeclineProposal from './hooks/useDecline';


export const useDeclineModal = ({ modalId }: {modalId: string}) => {
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const [declinePayload, setDeclinePayload] = useState({
    action: '',
    comment: '',
  });

  const { isPending: declineLoading, mutate } = useDeclineProposal({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(modalId);
          closeNiceModal(MODAL.GLOBAL.SUCCESS);
          router.push(apuPpt.REQUEST_LIST_PAGE);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnSave = () => {
    const payload = {
      action: declinePayload.action,
      bucketProcessId: processId,
      comment: declinePayload.comment,
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT,
    };

    mutate(payload);
  };

  return {
    declineLoading,
    declinePayload,
    handleOnSave,
    setDeclinePayload,
  };
};
