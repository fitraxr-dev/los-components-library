import { useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { APPROVE, CLOSE, DRAFT } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { userManagement } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import Button from '@/components/shared/Button';

import useGetDetailUser from '../../../hooks/useGetDetailUser';

import type { UserDetailProps } from './UserDetail.types';


const useUserDetail = (props: UserDetailProps) => {
  const { id } = props;
  const router = useCustomRouter();
  const theme = useTheme();
  const { actions, setBucketProcessIdForStepper, setIsUserDetailLoading } = useUserManagementContext();

  const {
    data: detailUserData,
    isLoading: isDetailUserLoading,
    isSuccess: isDetailUserSuccess,
  } = useGetDetailUser({ userId: id });

  useEffect(() => {
    setIsUserDetailLoading(isDetailUserLoading);
  }, [isDetailUserLoading, setIsUserDetailLoading]);

  const queryClient = useQueryClient();

  const bucketProccessId = detailUserData?.bucketProcessId;

  const isUserHasChanged = detailUserData?.userHasChanged;

  const disallowResetPasswordStatus = ['RETURN_TO_MAKER', 'WAITING_APPROVAL_CHECKER', DRAFT];
  const disallowResetPassword = !disallowResetPasswordStatus.includes(detailUserData?.status);

  const handleEditUser = () => {
    router.push(replacePath(userManagement.USER_LIST.EDIT, { id }));
  };

  const userDetailCellData = [
    { title: 'User Type', value: detailUserData?.userType },
    { title: 'Email', value: detailUserData?.email },
    { title: 'ID Process', value: detailUserData?.bucketProcessId },
    { title: 'User ID', value: detailUserData?.userId },
    {
      title: 'User Group',
      value: (detailUserData?.status === 'IN_ACTIVE' && detailUserData?.accessManagements?.[0])
        ? detailUserData?.accessManagements?.[0]?.userGroup?.name
        : detailUserData?.accessManagementActive?.userGroup?.name,
    },
    { title: 'Nama', value: detailUserData?.fullName },
    ...(detailUserData?.userType === 'INTERNAL'
      ? [{ title: 'Nomor Induk Karyawan', value: detailUserData?.nik }]
      : []
    ),
    ...(detailUserData?.userType?.toUpperCase() === 'INTERNAL'
      ? [
        { title: 'Account Privy ID', value: detailUserData?.privyId },
      ]
      : []
    ),
    { title: 'Access Menu Name', value: detailUserData?.permission?.label },
    { title: 'Refrensi Pengajuan', value: detailUserData?.reference },
    {
      title: 'Role',
      value: (detailUserData?.status === 'IN_ACTIVE' && detailUserData?.accessManagements?.[0])
        ? detailUserData?.accessManagements?.[0]?.userRoleRefactor?.name
        : detailUserData?.accessManagementActive?.userRoleRefactor?.name,
    },
    ...(detailUserData?.userType === 'INTERNAL'
      ? [
        {
          title: 'Divisi',
          value: (detailUserData?.status === 'IN_ACTIVE' && detailUserData?.accessManagements?.[0])
            ? detailUserData?.accessManagements?.[0]?.userDivision?.name
            : detailUserData?.accessManagementActive?.userDivision?.name,
        },
        {
          title: 'Direktorat',
          value: (detailUserData?.status === 'IN_ACTIVE' && detailUserData?.accessManagements?.[0])
            ? detailUserData?.accessManagements?.[0]?.userDivision?.directorate?.name
            : detailUserData?.accessManagementActive?.userDivision?.directorate?.name,
        }
      ]
      : []
    ),
    {
      title: 'Posisi',
      value: ((detailUserData?.status === 'IN_ACTIVE' && detailUserData?.accessManagements?.[0])
        ? detailUserData?.accessManagements?.[0]?.userPosition
        : detailUserData?.accessManagementActive?.userPosition
      )?.map((item) => item.name).join(', '),
    },
    ...(detailUserData?.userType === 'EXTERNAL'
      ? [{ title: 'Instansi', value: detailUserData?.institute }]
      : []
    ),
    ...(detailUserData?.userType === 'INTERNAL'
      ? [{
        title: 'Report To',
        value: (detailUserData?.status === 'IN_ACTIVE' && detailUserData?.accessManagements?.[0])
          ? detailUserData?.accessManagements?.[0]?.userSuperior?.fullName
          : detailUserData?.accessManagementActive?.userSuperior?.fullName,
      }]
      : []
    ),
    { title: 'Status User', value: detailUserData?.statusLabel },
    {
      title: 'Last Login',
      value: detailUserData?.lastLoginDate
        ? formatDate(new Date(detailUserData?.lastLoginDate), 'DD MMM YYYY, HH:mm:ss')
        : '',
    },
    {
      title: 'Last Logout',
      value: detailUserData?.lastLogoutDate
        ? formatDate(new Date(detailUserData?.lastLogoutDate), 'DD MMM YYYY, HH:mm:ss')
        : '',
    },
    {
      title: 'Modify Approved Date',
      value: detailUserData?.lastModifiedDate
        ? formatDate(new Date(detailUserData.lastModifiedDate), 'DD MMM YYYY, HH:mm:ss')
        : '',
    },
    {
      title: 'Created Date',
      value: detailUserData?.createdDate
        ? formatDate(new Date(detailUserData?.createdDate), 'DD MMM YYYY, HH:mm:ss')
        : '',
    },
    {
      title: 'Keterangan',
      value: detailUserData?.description,
    },
  ];

  const accountDetailCellData = [
    { title: 'Status Account', value: detailUserData ? detailUserData?.userAccount?.locked ? 'Locked' : 'Available' : '' },
    { title: 'Reason', value: detailUserData?.userAccount?.reason },
    { title: 'Expired', value: detailUserData ? detailUserData?.userAccount?.expired === true ? 'Ya' : 'Tidak' : '' },
    { title: 'Expired Date', value: detailUserData?.userAccount?.expiredDate ? formatDate(new Date(detailUserData?.userAccount?.expiredDate)) : '' },
  ];

  const { mutate: submitBucket, isPending: isLoading } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['um-user-submission-list']});
      showNiceModalV2({
        onClose: () => {
          router.push(userManagement.USER_LIST.BUCKET_LIST);
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
            bucketProcessId: id,
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
            bucketProcessId: id,
            comment,
            module: TypeModule.USER_MANAGEMENT,
            process: TypeProcess.USER_MANAGEMENT,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const buttonDict = ['REJECT', 'RETURN_TO_MAKER', APPROVE];

  const renderActionButtons = () => {
    if (!!actions) {
      return null;
    }

    let buttonContents = [];

    for (const key in actions) {
      if (buttonDict.includes(key)) {
        const buttonDictIdx = buttonDict.indexOf(key);
        buttonContents[buttonDictIdx] = [key, actions[key]];
      }
    }

    const buttons = buttonContents.map((button) => {
      const [key, value] = button;
      switch (key) {
        case CLOSE:
          return (
            <Button
              variant="outlined"
              onClick={() => {}}
            >
              Close
            </Button>
          );
        case 'REJECT':
          return (
            <Button
              onClick={() => handleRejectCollaboration()}
              variant="outlined"
              color="error"
              isLoading={isLoading}
            >
              Reject
            </Button>
          );
        case 'RETURN_TO_MAKER':
          return (
            <Button
              onClick={() => handleSubmit(value)}
              variant="contained"
              color="darkBlue"
              isLoading={isLoading}
            >
              Return to Maker
            </Button>
          );
        case APPROVE:
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
        default:
          null;
      }
    });

    return buttons;
  };

  return {
    accountDetailCellData,
    bucketProccessId,
    disallowResetPassword,
    handleEditUser,
    isUserHasChanged,
    renderActionButtons,
    theme,
    userDetailCellData,
  };
};

export default useUserDetail;
