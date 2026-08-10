import { useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { userManagement } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';

import useGetDetailUser from '../../../shared/hooks/user-controller/useGetDetailUser';


const useUserManagementViewOnly = () => {
  const router = useCustomRouter();
  const theme = useTheme();
  const path = usePathname();
  const { processId }: {processId: string} = useParams();
  const [appState] = useApp();
  const { stepper } = appState;
  const { data: detailUser } = useGetDetailUser(processId);
  const sortedDict = ['RETURN_TO_STAFF', 'SUBMIT', 'APPROVE', 'DECLINE'];
  const actionButtons: Object = stepper.steps.find((step) => step.urlPath === getLastPath(path))?.action;

  const statusAllowEdit = useMemo(() => {
    return (detailUser?.bucketProcessId === null || stepper.from === 'DRAFT' || stepper.from === 'RETURN_TO_STAFF') && !appState.currentRole.includes(roles.TL);
  }, [detailUser, stepper]);

  let modifiedObject = statusAllowEdit && processId.startsWith('UM-') ? { SUBMIT: 'SUBMIT' } : {};
  let sortedObject = {};
  for (const key in actionButtons) {
    if (key.includes('CANCEL') || key.includes('REJECT')) {
      modifiedObject['DECLINE'] = 'DECLINE';
    } else {
      modifiedObject[key] = actionButtons[key];
    }
  }

  const sortedKeys = sortedDict.filter((key) => Object.keys(modifiedObject).includes(key));

  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
  });

  const divisionMapping = () => {
    return detailUser?.division?.map((a) => a.name).join(', ');
  };

  const positionMapping = () => {
    return detailUser?.position?.map((a) => a.name).join(', ');
  };


  const handleEditUser = () => {
    router.push(replacePath(userManagement.EDIT_USER, { processId }));
  };

  const { mutate: submitBucket, isPending: isLoading } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          router.push(userManagement.USER_LIST);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleRejectCollaboration = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.USER_MANAGEMENT,
            process: TypeProcess.USER_MANAGEMENT,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Choose Reason:',
      radioOptions: [
        { label: 'Cancel', value: 'CANCELED' },
        { label: 'Reject', value: 'REJECTED' }
      ],
    });
  };

  const handleSubmit = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.USER_MANAGEMENT,
            process: TypeProcess.USER_MANAGEMENT,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };


  const handleButton = (key: string, value: string) => {
    switch (key) {
      case 'SUBMIT':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="success"
            isLoading={isLoading}
          >
            Submit
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="success"
            isLoading={isLoading}
          >
            Approve
          </Button>
        );
      case 'RETURN_TO_STAFF':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="darkBlue"
            isLoading={isLoading}
          >
            Return to Staff
          </Button>
        );
      default:
        return (
          <Button
            onClick={() => handleRejectCollaboration()}
            variant="outlined"
            color="error"
            isLoading={isLoading}
          >
            Rejected
          </Button>
        );
    }
  };

  const renderActionButtons = () => {
    return sortedObject ? Object.entries(sortedObject).map((dt: [string, string], index: number) => {
      return (handleButton(dt[0], dt[1]));
    }) : null;
  };

  return {
    detailUser,
    divisionMapping,
    handleEditUser,
    positionMapping,
    renderActionButtons,
    statusAllowEdit,
    theme,
  };
};

export default useUserManagementViewOnly;
