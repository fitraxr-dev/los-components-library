import { useContext, useState } from 'react';


import { MODAL } from '@/configs/constants/modalId';
import { mip } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useBucketSubmit from '@/hooks/services/processor/useBucketSubmit';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { CANCEL, CANCELED, REJECT } from './DeclineModal.constants';


export const useDeclineModal = ({ modalId }: {modalId: string}) => {
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [action, setAction] = useState({});
  const [state] = useApp();

  const handleOnSave = (data) => {
    const savePayload = {
      action: data.status,
      bucketProcessId: processId,
      comment: data.comment,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    };
    setAction(savePayload.action);
    mutate(savePayload);
  };

  const { isPending: declineLoading, mutate } = useBucketSubmit({
    onError: () => {
      showNiceModalV2({
        title: 'MIP gagal di cancel',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      closeNiceModal(modalId);
      recordActivity({
        activity: action as ActivityType ?? ActivityType.CANCEL,
        bucketProcessId: String(processId),
        menuCode: 'mip',
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
        remarks: `${action} MIP with Id: ${String(processId)} from status MIP REVISION`,
      });
      const isCanceled = data.data.status === CANCELED;
      showNiceModalV2({
        title: `MIP berhasil di ${ isCanceled ? CANCEL : REJECT }`,
        type: 'success',
      });
      setTimeout(() => {
        closeNiceModal(MODAL.GLOBAL.SUCCESS);
        router.push(mip.LIST_PAGE);
      }, 1000);
    },
  });

  return {
    declineLoading,
    handleOnSave,
  };
};
