import { useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';


import { SUBMIT } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import {
  apuPpt,
  creditChecking,
  lpaRequestReview,
  siteVisit,
  technicalStudyReview,
} from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCheckAvailableRequest from '@/hooks/services/bucket/useGetCheckAvailableRequest';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useRegisterBucket from '@/hooks/services/useRegisterBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

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
    process: TypeProcess.MUP,
  });

  const {
    data: checkAvailableRequestData,
    isLoading: isCheckAvailableRequestLoading,
  } = useGetCheckAvailableRequest({
    bucketMasterId: bucketData?.bucketMaster,
    process: TypeProcess.MUP,
  }, {
    enabled: !!bucketData?.bucketMaster,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const { mutate: saveRequestOtherProcess } = useRegisterBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Request gagal dikirim',
        type: 'error',
      });
    },
    onSuccess: (data: BucketCreateResponseDto) => {
      const process = data.process;
      let path = null;
      switch (process) {
        case TypeProcess.CREDIT_CHECKING:
          path = replacePath(
            creditChecking.REQUEST_DEBTOR_INFORMATION_PAGE,
            {
              processId: data.bucketProcessId,
            });
          break;
        case TypeProcess.SITE_VISIT:
          path = replacePath(
            siteVisit.DEBTOR_INFORMATION_PAGE,
            {
              processId: data.bucketProcessId,
            },
          );
          break;
        case TypeProcess.LPA:
          path = replacePath(
            lpaRequestReview.DEBTOR_INFORMATION,
            {
              module: 'bucket-list',
              processId: data.bucketProcessId,
            },
          );
          break;
        case TypeProcess.TECHNICAL_REVIEW:
          path = replacePath(
            technicalStudyReview.DEBTOR_INFORMATION_PAGE,
            {
              module: 'request',
              processId: data.bucketProcessId,
            },
          );
          break;
        case TypeProcess.APU_PPT:
          path = replacePath(
            apuPpt.REQUEST_DEBTOR_INFORMATION_PAGE,
            {
              processId: data.bucketProcessId,
            },
          );
          break;
        default:
          path = null;
          break;
      }
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS);
          if (path) router.push(path);
        },
        title: 'Request berhasil dikirim',
        type: 'success',
      });
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
        process: TypeProcess.MUP,
        remarks: 'check available request other process',
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
          process: TypeProcess.MUP,
          remarks: `save request other process: ${process.process} with comment`,
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
          ...payload,
        });
      },
    });
  };

  return {
    checkAvailableRequestData,
    getDisabledStatusRequestOtherProcess,
    handleOnClickProcess,
    isCheckAvailableRequestLoading,
  };
};

export default useModalRequestOtherProcess;
