import { useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';


import { SUBMIT } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCheckAvailableRequest from '@/hooks/services/bucket/useGetCheckAvailableRequest';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useRegisterBucketDebtor from '../../hooks/useRegisterBucketDebtor';

import { modal } from './ModalRequestOtherProcess.constants';

import type { RequestOtherProcess } from './ModalRequestOtherProcess.types';
import type { BucketCreateResponseDto } from '@/services/openapi/bucket-service';


const useModalRequestOtherProcess = () => {
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  const { data: bucketData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MUP,
    process: TypeProcess.MUP_ANALYST,
  });

  const {
    data: checkAvailableRequestData,
    isLoading: isCheckAvailableRequestLoading,
  } = useGetCheckAvailableRequest({
    bucketMasterId: bucketData?.bucketMaster,
    process: TypeProcess.MUP_ANALYST,
  }, {
    enabled: !!bucketData?.bucketMaster,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const { mutate: saveRequestOtherProcess } = useRegisterBucketDebtor({
    onError: () => {
      showNiceModalV2({
        title: 'Request gagal dikirim',
        type: 'error',
      });
    },
    onSuccess: (data: BucketCreateResponseDto, variables: {urlPath: string}) => {
      showNiceModalV2({
        title: 'Request berhasil dikirim',
        type: 'success',
      });

      router.push(replacePath(variables.urlPath, { processId: data.bucketProcessId }));
    },
  });

  function getDisabledStatusRequestOtherProcess(process: string) {
    const requestOption = (checkAvailableRequestData as any[])
      ?.find((item) => item.targetProcess === process);
    const isDisabled = !requestOption?.isEnable;

    return isDisabled;
  }

  useEffect(() => {
    if (!isCheckAvailableRequestLoading && checkAvailableRequestData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({ availableRequests: checkAvailableRequestData }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP_ANALYST,
        remarks: 'check available request other process from MUP Analyst',
      });
    }
  }, [checkAvailableRequestData, isCheckAvailableRequestLoading]);

  const handleOnClickProcess = (process: RequestOtherProcess) => {
    closeNiceModal(modal.REQUEST_OTHER_PROCESS);

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        recordActivity({
          activity: ActivityType.SAVE,
          bucketProcessId: processId,
          changeAfter: JSON.stringify({ action: 'request_other_process', comment, processType: process.process }),
          module: TypeModule.MUP,
          process: TypeProcess.MUP_ANALYST,
          remarks: `save request other process: ${process.process} with comment from MUP Analyst`,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);

        const payload = {
          action: SUBMIT,
          bucketProcessId: processId,
          comment,
          module: process.module,
          process: process.process,
        };

        saveRequestOtherProcess({
          payload,
          urlPath: process.urlPath,
        });
      },
    });
  };

  return {
    getDisabledStatusRequestOtherProcess,
    handleOnClickProcess,
    isCheckAvailableRequestLoading,
  };
};

export default useModalRequestOtherProcess;
