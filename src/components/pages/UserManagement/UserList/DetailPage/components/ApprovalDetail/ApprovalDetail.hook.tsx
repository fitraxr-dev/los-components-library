import { useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { APPROVE, CLOSE } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { userManagement } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import Button from '@/components/shared/Button';

import useGetDetailSubmission from '../../../hooks/useGetDetailSubmission';

import type { ApprovalDetailProps } from './ApprovalDetail.types';


const useApprovalDetail = (props: ApprovalDetailProps) => {
  const { processId } = props;
  const { isStaff, actions, setBucketProcessIdForStepper, setIsUserDetailLoading } = useUserManagementContext();
  const { recordActivity } = useRecordLog();

  const router = useRouter();

  const {
    data: detailSubmissionData,
    isLoading: isDetailSubmissionLoading,
    isSuccess: isDetailSubmissionSuccess,
  } = useGetDetailSubmission({ bucketProcessId: processId }, {
    enabled: !!processId,
  });

  useEffect(() => {
    setIsUserDetailLoading(isDetailSubmissionLoading);
  }, [isDetailSubmissionLoading, setIsUserDetailLoading]);

  const isShowButton = detailSubmissionData?.editButtonShow;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isDetailSubmissionSuccess && detailSubmissionData?.bucketProcessId) {
      setBucketProcessIdForStepper(detailSubmissionData.bucketProcessId);
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: detailSubmissionData.bucketProcessId,
        module: TypeModule.USER_MANAGEMENT,
        process: TypeProcess.USER_MANAGEMENT,
        remarks: 'view user detail submission page',
      });
    } else if (isDetailSubmissionSuccess && !detailSubmissionData?.bucketProcessId) {
      setBucketProcessIdForStepper(undefined);
    }
  }, [isDetailSubmissionSuccess, detailSubmissionData?.bucketProcessId, setBucketProcessIdForStepper]);


  const isDraft = detailSubmissionData?.accessManagementActive.userSubmissionId.statusSubmissionLabel === 'Draft';
  const isReturnToStaff = detailSubmissionData?.accessManagementActive.userSubmissionId.statusSubmissionLabel === 'Return To Staff';

  const userDetailCellData = [
    { title: 'User Type', value: detailSubmissionData?.userType },
    { title: 'Email', value: detailSubmissionData?.email },
    { title: 'ID Process', value: detailSubmissionData?.bucketProcessId },
    { title: 'User ID', value: detailSubmissionData?.userId },
    {
      title: 'User Group',
      value: (detailSubmissionData?.status === 'IN_ACTIVE' && detailSubmissionData?.accessManagements?.[0])
        ? detailSubmissionData?.accessManagements?.[0]?.userGroup?.name
        : detailSubmissionData?.accessManagementActive?.userGroup?.name,
    },
    { title: 'Nama', value: detailSubmissionData?.fullName },
    ...(detailSubmissionData?.userType?.toUpperCase() === 'INTERNAL'
      ? [{ title: 'Nomor Induk Karyawan', value: detailSubmissionData?.nik }]
      : []
    ),
    ...(detailSubmissionData?.userType?.toUpperCase() === 'INTERNAL'
      ? [
        { title: 'Account Privy ID', value: detailSubmissionData?.privyId },
      ]
      : []
    ),
    { title: 'Access Menu Name', value: detailSubmissionData?.permission?.label },
    { title: 'Refrensi Pengajuan', value: detailSubmissionData?.reference },
    {
      title: 'Role',
      value: (detailSubmissionData?.status === 'IN_ACTIVE' && detailSubmissionData?.accessManagements?.[0])
        ? detailSubmissionData?.accessManagements?.[0]?.userRoleRefactor?.name
        : detailSubmissionData?.accessManagementActive?.userRoleRefactor?.name,
    },
    ...(detailSubmissionData?.userType?.toUpperCase() === 'INTERNAL'
      ? [
        {
          title: 'Divisi',
          value: (detailSubmissionData?.status === 'IN_ACTIVE' && detailSubmissionData?.accessManagements?.[0])
            ? detailSubmissionData?.accessManagements?.[0]?.userDivision?.name
            : detailSubmissionData?.accessManagementActive?.userDivision?.name,
        },
        {
          title: 'Direktorat',
          value: (detailSubmissionData?.status === 'IN_ACTIVE' && detailSubmissionData?.accessManagements?.[0])
            ? detailSubmissionData?.accessManagements?.[0]?.userDivision?.directorate?.name
            : detailSubmissionData?.accessManagementActive?.userDivision?.directorate?.name,
        }
      ]
      : []
    ),
    {
      title: 'Posisi',
      value: ((detailSubmissionData?.status === 'IN_ACTIVE' && detailSubmissionData?.accessManagements?.[0])
        ? detailSubmissionData?.accessManagements?.[0]?.userPosition
        : detailSubmissionData?.accessManagementActive?.userPosition
      )?.map((item) => item?.name)?.join(', '),
    },
    ...(detailSubmissionData?.userType?.toUpperCase() === 'EXTERNAL'
      ? [{ title: 'Instansi', value: detailSubmissionData?.institute }]
      : []
    ),
    ...(detailSubmissionData?.userType?.toUpperCase() === 'INTERNAL'
      ? [{
        title: 'Report To',
        value: (detailSubmissionData?.status === 'IN_ACTIVE' && detailSubmissionData?.accessManagements?.[0])
          ? detailSubmissionData?.accessManagements?.[0]?.userSuperior?.fullName
          : detailSubmissionData?.accessManagementActive?.userSuperior?.fullName,
      }]
      : []
    ),
    { title: 'Status User', value: detailSubmissionData?.statusLabel },
    {
      title: 'Last Login',
      value: detailSubmissionData?.lastLoginDate
        ? formatDate(new Date(detailSubmissionData?.lastLoginDate), 'DD MMM YYYY, HH:mm:ss')
        : '',
    },
    {
      title: 'Last Logout',
      value: detailSubmissionData?.lastLogoutDate
        ? formatDate(new Date(detailSubmissionData?.lastLogoutDate), 'DD MMM YYYY, HH:mm:ss')
        : '',
    },
    {
      title: 'Modify Approved Date',
      value: detailSubmissionData?.lastModifiedDate
        ? formatDate(new Date(detailSubmissionData?.lastModifiedDate), 'DD MMM YYYY, HH:mm:ss')
        : '',
    },
    {
      title: 'Created Date',
      value: detailSubmissionData?.createdDate
        ? formatDate(new Date(detailSubmissionData?.createdDate), 'DD MMM YYYY, HH:mm:ss')
        : '',
    },
    {
      title: 'Keterangan',
      value: detailSubmissionData?.description,
    },
  ];

  const accountDetailCellData = [
    { title: 'Status Account', value: detailSubmissionData ? detailSubmissionData?.userAccount?.locked ? 'Locked' : 'Available' : '' },
    { title: 'Reason', value: detailSubmissionData?.userAccount?.reason },
    { title: 'Expired', value: detailSubmissionData ? detailSubmissionData?.userAccount?.expired === true ? 'Ya' : 'Tidak' : '' },
    { title: 'Expired Date', value: detailSubmissionData?.userAccount?.expiredDate ? formatDate(new Date(detailSubmissionData?.userAccount?.expiredDate)) : '' },
  ];

  const { mutate: submitBucket, isPending: isLoading } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data, variable) => {
      const action = variable?.submitRequestDto?.action;
      let activityType = ActivityType.SUBMIT;
      let remarks;

      if (action === 'APPROVE' || action.includes('APPROVE')) {
        activityType = ActivityType.APPROVE;
        remarks = 'approve user data';
      } else if (action.includes('RETURN_TO')) {
        activityType = ActivityType.RETURN_TO_MAKER;
        remarks = `reject and return user data (${action})`;
      } else if (action === 'CANCELED') {
        activityType = ActivityType.CANCEL;
        remarks = 'cancel user data ';

      } else if (action === 'REJECT') {
        activityType = ActivityType.REJECT;
        remarks = 'reject user data ';
      }

      recordActivity({
        activity: activityType,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(variable),
        module: TypeModule.USER_MANAGEMENT,
        process: TypeProcess.USER_MANAGEMENT,
        remarks: remarks,
      });

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

  const handleEditUser = () => {
    router.push(replacePath(userManagement.USER_LIST.EDIT, { id: processId }));
  };

  const handleReject = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: 'REJECTED',
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

  function handleOnCancelProcess() {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: 'CANCELED',
            bucketProcessId: processId,
            comment,
            module: TypeModule.USER_MANAGEMENT,
            process: TypeProcess.USER_MANAGEMENT,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },

    });
  }

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

  const buttonDict = ['REJECT', 'RETURN_TO_MAKER', APPROVE, 'CANCEL'];

  const renderActionButtons = () => {

    if (!actions) {
      return null;
    }

    let buttonContents = [];

    for (const key in actions.action) {
      if (buttonDict.includes(key)) {
        const buttonDictIdx = buttonDict.indexOf(key);
        buttonContents[buttonDictIdx] = [key, actions[key]];
      }
    }

    const buttons = buttonContents.map((button) => {
      const [key, value] = button;

      if (!isStaff) {
        switch (key) {
          case CLOSE:
            return (
              <Button
                variant="outlined"
                onClick={() => { }}
              >
                Close
              </Button>
            );
          case 'REJECT':
            return (
              <Button
                onClick={handleReject}
                variant="outlined"
                color="error"
                isLoading={isDetailSubmissionLoading}
              >
                Reject
              </Button>
            );
          case 'RETURN_TO_MAKER':
            return (
              <Button
                onClick={() => handleSubmit(key)}
                variant="contained"
                color="primary"
                isLoading={isDetailSubmissionLoading || isLoading}
              >
                Return to Maker
              </Button>
            );
          case APPROVE:
            return (
              <Button
                onClick={() => handleSubmit('APPROVED')}
                variant="contained"
                color="success"
                isLoading={isDetailSubmissionLoading || isLoading}
              >
                Approve
              </Button>
            );
          default:
            null;
        }
      } else {

        // switch (key) {
        //   case 'CANCEL':
        //     return (
        //       <Button
        //         onClick={handleOnCancelProcess}
        //         variant="outlined"
        //         color="error"
        //         isLoading={isDetailSubmissionLoading}
        //       >
        //         Cancel
        //       </Button>
        //     );
        //   default:
        //     null;
        // }
      }


    });

    return buttons;
  };


  return {
    accountDetailCellData,
    handleEditUser,
    isDetailSubmissionSuccess,
    isDraft,
    isReturnToStaff,
    isShowButton,
    renderActionButtons,
    userDetailCellData,
  };
};

export default useApprovalDetail;
