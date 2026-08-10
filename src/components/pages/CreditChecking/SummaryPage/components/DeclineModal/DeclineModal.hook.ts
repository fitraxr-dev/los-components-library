import NiceModal from '@ebay/nice-modal-react';


import { MODAL } from '@/configs/constants/modalId';
import { mip } from '@/configs/constants/pathname';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { CANCEL, CANCELED, REJECT } from './DeclineModal.constants';
import useDeclineProposal from './hooks/useDeclineProposal';


export const useDeclineModal = ({ modalId }: {modalId: string}) => {
  const router = useCustomRouter();
  const { processId } = useIdentity();

  const { isPending: declineLoading, mutate } = useDeclineProposal({
    onError: () => {
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        title: 'MIP gagal di cancel',
      });
    },

    onSuccess: (data) => {
      closeNiceModal(modalId);

      const isCanceled = data.data.status === CANCELED;
      showNiceModalV2({ title: `MIP berhasil di ${ isCanceled ? CANCEL : REJECT }`, type: 'success' });

      setTimeout(() => {
        closeNiceModal(MODAL.GLOBAL.SUCCESS);
        router.push(mip.LIST_PAGE);
      }, 1000);
    },
  });

  const handleOnSave = (data) => {
    const payload = {
      bucketProcessId: processId,
      comment: data.comment,
      status: data.status,
    };

    mutate(payload);
  };

  return {
    declineLoading,
    handleOnSave,
  };
};
