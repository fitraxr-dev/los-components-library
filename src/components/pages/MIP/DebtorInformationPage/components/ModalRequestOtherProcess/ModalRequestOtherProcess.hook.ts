import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { ONE_MINUTE } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import {
  apuPpt,
  creditChecking,
  lpaRequestReview,
  siteVisit,
  technicalStudyReview,
} from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { extractPaths } from '@/helpers/utils';
import useGetCheckAvailableRequest from '@/hooks/services/bucket/useGetCheckAvailableRequest';
import useRegisterBucket from '@/hooks/services/useRegisterBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetAppsMenu from '@/components/pages/UserManagement/AccessMenu/hooks/useGetAccessMenuById';


import { modal, requestOtherProcessOptions, urlPaths } from './ModalRequestOtherProcess.constants';

import type { ModalRequestOtherProcessProps, RequestOtherProcessOption } from './ModalRequestOtherProcess.types';
import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';


const useModalRequestOtherProcess = (props: ModalRequestOtherProcessProps) => {
  const { bucketMasterId } = props;
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const { data: menuList } = useGetAppsMenu();
  const [requestOptions, setRequestOptions] = useState(null);


  const hasPath = (paths, find) => paths.some((path) => path.includes(find));

  const {
    data: checkAvailableRequestData,
    isLoading: isCheckAvailableRequestLoading,
  } = useGetCheckAvailableRequest({
    bucketMasterId,
    process: TypeProcess.MIP,
  }, {
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const getReplacedPath = (path: string, id: string, process: string) => {
    const bucketProcessId = id;
    let nextPath = replacePath(path, { processId: bucketProcessId });

    if (process === TypeProcess.LPA) {
      nextPath = replacePath(path, { module: 'bucket-list', processId: bucketProcessId });
    } else if (process === TypeProcess.TECHNICAL_REVIEW) {
      nextPath = replacePath(path, { module: 'request', processId: bucketProcessId });
    }

    return nextPath;
  };

  const { mutate: requestProcess } = useRegisterBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Request gagal terkirim',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      closeNiceModal(modal.REQUEST_OTHER_PROCESS);
      const process = data.process;
      const bucketId = data.bucketProcessId;

      const path = {
        [TypeProcess.CREDIT_CHECKING]: getReplacedPath(creditChecking.REQUEST_DEBTOR_INFORMATION_PAGE,
          bucketId,
          process),
        [TypeProcess.SITE_VISIT]: getReplacedPath(siteVisit.DEBTOR_INFORMATION_PAGE,
          bucketId,
          process),
        [TypeProcess.LPA]: getReplacedPath(lpaRequestReview.DEBTOR_INFORMATION,
          bucketId,
          process),
        [TypeProcess.TECHNICAL_REVIEW]: getReplacedPath(technicalStudyReview.DEBTOR_INFORMATION_PAGE,
          bucketId,
          process),
        [TypeProcess.APU_PPT]: getReplacedPath(apuPpt.REQUEST_DEBTOR_INFORMATION_PAGE,
          bucketId,
          process),
      };

      if (process === TypeProcess.MIP_ANALYST) {
        showNiceModalV2({
          title: 'Request berhasil dibuat',
          type: 'success',
        });
      } else if (hasPath(extractPaths(menuList), urlPaths[process])) {
        showNiceModalV2({
          onClose: () => {
            closeNiceModal(MODAL.GLOBAL.SUCCESS);
            if (path[process]) {
              router.push(path[process]);
            }
          },
          title: 'Request berhasil dibuat',
          type: 'success',
        });
      } else {
        showNiceModalV2({
          cancelText: 'Tutup',
          submitText: 'OK',
          title: 'User tidak memiliki akses ke module tersebut',
          type: 'warning',
        });
      }
    },
  });

  function getDisabledStatusRequestOtherProcess(process: string) {
    const requestOption = (checkAvailableRequestData as any[])
      .find((item) => item.targetProcess === process);
    const isDisabled = !requestOption?.isEnable;

    return isDisabled;
  }

  useEffect(() => {

    if (!isCheckAvailableRequestLoading) {


      const options = requestOtherProcessOptions.map((item) => ({
        ...item,
        isDisabled: getDisabledStatusRequestOtherProcess(item.process),
      }));

      setRequestOptions(options);
    }

  }, [checkAvailableRequestData]);

  const handleOnClickOption = (option: RequestOtherProcessOption) => {
    if (option.hasComment) {
      NiceModal.show(
        MODAL.GLOBAL.COMMENT,
        {
          onSave: ({ comment }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);
            const payload: BucketCreateRequestDto = {
              bucketProcessId: processId,
              comment,
              module: option.module,
              process: option.process,
            };
            requestProcess(payload);
          },
        },
      );
    } else {
      const payload: BucketCreateRequestDto = {
        bucketProcessId: processId,
        comment: null,
        module: option.module,
        process: option.process,
      };
      requestProcess(payload);
    }
  };

  return {
    handleOnClickOption,
    isCheckAvailableRequestLoading,
    requestOptions,
  };
};

export default useModalRequestOtherProcess;
