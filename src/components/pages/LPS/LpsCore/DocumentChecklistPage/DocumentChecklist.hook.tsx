'use client';
import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import { RETURN_TO_STAFF, RETURN_TO_TL, roles, SUBMIT } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketChildList from '@/hooks/services/useGetBucketChildList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useLpsCoreContext } from '@/components/layouts/LpsLayoutCore/LpsLayoutCore.context';
import Button from '@/components/shared/Button';


const useDocumentChecklist = () => {
  const { processId, parentId } = useIdentity();
  const [user] = useApp();
  const { actionButtons, isDocumentSelected, isDivisiBisnis } = useLpsCoreContext();
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();
  const { data: childList, isSuccess } = useGetBucketChildList({
    filter: {
      bucketParent: parentId,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.PROCESSING_TYPE_PK,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });
  const processNumber = processId.split('-')[1];

  const bucketId = isSuccess && childList.contents?.find((res) =>
    res?.bucketProcessId?.includes(`LPSB-${processNumber}`)
  )?.bucketProcessId || '';
  const isRm = user.currentRole.includes(roles.RM);
  const isKadiv = user.currentRole.includes(roles.KADIV);

  const { mutate: submitBucket, isPending: isLoadingSubmit } = useSubmitBucket(
    {
      onError: (error: any) => {
        showNiceModalV2({ title: error?.message, type: 'error' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        showNiceModalV2({ onClose: () => { }, title: 'Data berhasil dikirim', type: 'success' });
      },
    }
  );

  const handleSubmit = (action: string) => {
    if (!isDocumentSelected && !viewOnly && isDivisiBisnis && (action !== 'RETURN_TO_STAFF' && action !== 'RETURN_TO_TL')) {
      showNiceModalV2({ title: 'Mohon pilih dokumen terlebih dahulu', type: 'warning' });
      return;
    }

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.LPS,
            process: TypeProcess.LPS_CORE,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleApprove = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.LPS,
            process: TypeProcess.LPS_CORE,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const getSubmitBtnText = () => {
    if (isDivisiBisnis && !isKadiv) {
      return 'Submit';
    } else if (isDivisiBisnis && isKadiv) {
      return 'Approve';
    } else {
      return 'Confirm';
    }
  };

  const sortArray = () => {
    let arr: string[] = [];
    if (isRm && isDivisiBisnis) {
      arr = [
        'SAVE',
        'SUBMIT',
      ];
    } else if (!isDivisiBisnis) {
      arr = [
        'NEXT',
      ];
    } else {
      arr = [
        'SAVE',
        'RETURN_TO_STAFF',
        'RETURN_TO_TL',
        'APPROVE',
        'SUBMIT',
      ];
    }
    return arr;
  };

  const sortedKeys = actionButtons && sortArray().filter((key) => Object.keys(actionButtons).includes(key));

  let sortedObject = {};
  sortedKeys && sortedKeys.forEach((key) => {
    sortedObject[key] = actionButtons[key];
  });

  const handleButton = (key: string, value: string) => {
    switch (key) {
      case RETURN_TO_STAFF:
        return (
          <Button
            color="darkBlue"
            disabled={isLoadingSubmit}
            isLoading={isLoadingSubmit}
            onClick={() => handleSubmit(value)}
          >
            Return to Staff
          </Button>
        );
      case RETURN_TO_TL:
        return (
          <Button
            color="info"
            disabled={isLoadingSubmit}
            isLoading={isLoadingSubmit}
            onClick={() => handleSubmit(value)}
          >
            Return to TL
          </Button>
        );
      case SUBMIT:
        return (
          <Button
            color="success"
            disabled={isLoadingSubmit}
            isLoading={isLoadingSubmit}
            onClick={() => handleSubmit(value)}
          >
            {getSubmitBtnText()}
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            onClick={() => handleApprove(value)}
            variant="contained"
            color="success"
            disabled={isLoadingSubmit}
            isLoading={isLoadingSubmit}
          >
            {isKadiv ? 'Approve' : 'Submit'}
          </Button>
        );
      default:
        return null;
    }
  };

  return {
    bucketId,
    handleButton,
    sortedObject,
  };
};

export default useDocumentChecklist;
