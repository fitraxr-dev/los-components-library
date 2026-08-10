import { useContext } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';


import { MODAL } from '@/configs/constants/modalId';
import { risalahRapat } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useSubmitPrivy from '@/hooks/services/useSubmitPrivy';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { RisalahRapatContext } from '@/components/layouts/RisalahRapatLayout/RisalahRapatLayout.context';
import Button from '@/components/shared/Button';

import useConfirmCollaboration from '../../hooks/useConfirmCollaboration';
import useResetCollaboration from '../../hooks/useResetCollaboration';


const useSaveButtons = () => {
  const [state] = useContext(RisalahRapatContext);
  const actionButtons = state.actionButtons;
  const modifiedObject = {};
  const queryClient = useQueryClient();
  const path = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const isFetching = useIsFetching();

  const segments: string[] = path.split('/');

  const { isSuccess: submitBucketIsSuccess, mutate: submitBucket } = useSubmitBucket(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        showNiceModalV2({
          onClose: () => {
            const pathArr = path.split('/');
            pathArr.splice(-2, 2);
            const url = pathArr.join('/');
            router.push(url);
          }, title: 'Rinkasan berhasil di simpan', type: 'success',
        });
      },
    }
  );


  const { isSuccess: submitPrivyIsSuccess, mutate: submitPrivy } = useSubmitPrivy({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      showNiceModalV2({
        title: 'Privy berhasil di buat', type: 'success',
      });
    },
  });

  const { isSuccess: resetCollaborationSuccess, mutate: resetCollaboration } = useResetCollaboration(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        showNiceModalV2({
          onClose: () => {
            const pathArr = path.split('/');
            pathArr.splice(-2, 2);
            const url = pathArr.join('/');
            router.push(url);
          }, title: 'Rinkasan berhasil di simpan', type: 'success',
        });
      },
    }
  );

  const { isSuccess: confirmCollaborationSuccess, mutate: confirmCollaboration } = useConfirmCollaboration(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        showNiceModalV2({
          onClose: () => {
            const pathArr = path.split('/');
            pathArr.splice(-2, 2);
            const url = pathArr.join('/');
            router.push(url);
          }, title: 'Rinkasan berhasil di simpan', type: 'success',
        });
      },
    }
  );


  for (const key in actionButtons) {
    if (key.includes('CANCEL') || key.includes('REJECT')) {
      modifiedObject['DECLINE'] = 'DECLINE';
    } else {
      modifiedObject[key] = actionButtons[key];
    }
  }

  const handleButton = (key: string, value: string) => {
    switch (key) {
      case 'SUBMIT':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="success"
          >
            Submit
          </Button>
        );
      case 'CONFIRM':
        return (
          <Button
            onClick={() => handleConfirmCollaboration()}
            variant="contained"
            color="success"
          >
            Confirm
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="success"
          >
            Approve
          </Button>
        );
      case 'RETURN_TO_STAFF':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
          >
            Return to Staff
          </Button>
        );
      case 'RETURN_TO_TL':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="info"
          >
            Return to TL
          </Button>
        );
      case 'RESET_USER_COLLABORATION':
        return (
          <Button
            onClick={() => handleResetCollaboration()}
            variant="contained"
            color="error"
          >
            Reset User Collaboration
          </Button>
        );
      case 'SEND_TO_PRIVY':
        return (
          <Button
            onClick={() => handleSubmitToPrivy(value)}
            variant="contained"
            color="success"
          >
            Send To Privy
          </Button>
        );
      default:
        return (
          <Button
            onClick={handleRejectCollaboration}
            variant="outlined"
            color="error"
          >
            Decline
          </Button>
        );
    }
  };

  const handleSubmit = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.RISALAH_RAPAT,
            process: TypeProcess.RISALAH_RAPAT,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };


  const handleSubmitToPrivy = (action: string) => {
    submitPrivy({
      bucketProcessId: processId,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    });
  };

  const handleResetCollaboration = () => {
    resetCollaboration({
      bucketProcessId: processId,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    });
  };


  const handleConfirmCollaboration = () => {
    confirmCollaboration({
      bucketProcessId: processId,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    });
  };

  const handleRejectCollaboration = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DELST,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Choose Reason:',
      radioOptions: [
        { label: 'Cancel', value: 'CANCEL' },
        { label: 'Reject', value: 'REJECT' }
      ],
    });
  };

  const handleClose = () => {
    router.push(replacePath(risalahRapat.BASE_PAGE, {
      module: segments[3],
    }));
  };


  const renderActionButtons = () => {
    return modifiedObject ? Object.entries(modifiedObject).map((dt: [string, string], index: number) => {
      return (handleButton(dt[0], dt[1]));
    }) : null;
  };
  return {
    handleButton,
    handleClose,
    handleConfirmCollaboration,
    handleRejectCollaboration,
    handleSubmit,
    isFetching,
    modifiedObject,
    renderActionButtons,
  };
};

export default useSaveButtons;
