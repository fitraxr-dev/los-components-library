import { CANCELED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { mupAnalyst } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useDeclineAdditionalInformation from '../../hooks/useDeclineAdditionalInformation';


const useModalDecline = () => {
  const { processId } = useIdentity();
  const router = useCustomRouter();

  const { mutate, isPending: isDeclineLoading } = useDeclineAdditionalInformation({
    onError: () => {
      showNiceModalV2({
        title: 'MUP gagal dicancel',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      closeNiceModal(MODAL.DECLINE);

      const isCanceled = data.data.status === CANCELED;
      showNiceModalV2({
        title: `MUP berhasil ${isCanceled ? 'dicancel' : 'direject'}`,
        type: 'success',
      });
      setTimeout(() => {
        closeNiceModal(MODAL.GLOBAL.SUCCESS);
        router.push(mupAnalyst.LIST_PAGE);
      }, 1000);
    },
  });

  const handleOnSave = ({ status, comment }: {status: string; comment: string}) => {
    const payload = {
      action: status,
      bucketProcessId: processId,
      comment: comment,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    };

    mutate(payload);
  };

  return {
    handleOnSave,
    isDeclineLoading,
  };
};

export default useModalDecline;
