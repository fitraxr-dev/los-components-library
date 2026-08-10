import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { RE_ASSIGNMENT_SKU } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useBucketSubmit from '@/hooks/services/processor/useBucketSubmit';
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
  const queryClient = useQueryClient();


  const handleOnSave = (data) => {
    const savePayload = {
      action: data.status,
      bucketProcessId: processId,
      comment: data.comment,
      module: TypeModule.REASSIGNMENT_SKU,
      process: TypeProcess.REASSIGNMENT_SKU,
    };
    setAction(savePayload.action);
    mutate(savePayload);
  };

  const { isPending: declineLoading, mutate } = useBucketSubmit({
    onError: () => {
      showNiceModalV2({
        title: 'Assignment gagal di cancel',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      closeNiceModal(modalId);
      recordActivity({
        activity: action as ActivityType ?? ActivityType.CANCEL,
        bucketProcessId: String(processId),
        module: TypeModule.REASSIGNMENT_SKU,
        process: TypeProcess.REASSIGNMENT_SKU,
        remarks: `${action} Assignment with Id: ${String(processId)}`,
      });
      const isCanceled = data.data.status === CANCELED;
      showNiceModalV2({
        onClose: () => handleBackToTable(),
        title: `Assignment berhasil di ${ isCanceled ? CANCEL : REJECT }`,
        type: 'success',
      });
    },
  });

  const handleBackToTable = () => {
    router.push(RE_ASSIGNMENT_SKU.BASH_PATH);
    queryClient.invalidateQueries({
      queryKey: ['bucket-list', { bucketProcessId: processId }],
    });
  };

  return {
    declineLoading,
    handleOnSave,
  };
};
