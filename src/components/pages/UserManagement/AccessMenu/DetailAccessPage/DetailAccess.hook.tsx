import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';

import { APPROVE, CLOSE, SUBMIT } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { userManagement } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import Button from '@/components/shared/Button';

import useGetDetailSubmission from '../../UserList/hooks/useGetDetailSubmission';


const useDetailAccessMenu = () => {
  const [activeTab, setActiveTab] = useState('accessMenu');
  const queryClient = useQueryClient();
  const router = useRouter();
  const { actions, idParams } = useUserManagementContext();
  const { id }: { id: string } = useParams();
  const processId = id;
  const { recordActivity } = useRecordLog();

  // const {
  //   data: detailSubmissionData,
  //   isLoading: isDetailSubmissionLoading,
  //   isSuccess: isDetailSubmissionSuccess,
  // } = useGetDetailSubmission({ bucketProcessId: processId }, {
  //   enabled: !!processId,
  // });
  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

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
        remarks = 'approve access menu data';
      } else if (action.includes('RETURN_TO')) {
        activityType = ActivityType.RETURN_TO_MAKER;
        remarks = `reject and return access menu data (${action})`;
      } else if (action === 'CANCELED') {
        activityType = ActivityType.CANCEL;
        remarks = 'cancel access menu data ';

      } else if (action === 'REJECT') {
        activityType = ActivityType.REJECT;
        remarks = 'reject access menu data ';
      }


      recordActivity({
        activity: activityType,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(variable),
        module: TypeModule.ACCESS_MENU,
        process: TypeProcess.ACCESS_MENU,
        remarks: remarks,
      });
      queryClient.invalidateQueries({ queryKey: ['um-user-submission-list']});
      showNiceModalV2({
        onClose: () => {
          router.push(userManagement.ACCESS_MENU.BUCKET_LIST);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleReject = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: 'REJECTED',
            bucketProcessId: processId,
            comment,
            module: TypeModule.ACCESS_MENU,
            process: TypeProcess.ACCESS_MENU,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
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
            module: TypeModule.ACCESS_MENU,
            process: TypeProcess.ACCESS_MENU,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const buttonDict = ['REJECT', 'RETURN_TO_MAKER', SUBMIT];


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
            // isLoading={isDetailSubmissionLoading}
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
            // isLoading={isDetailSubmissionLoading || isLoading}
            >
              Return to Maker
            </Button>
          );
        case SUBMIT:
          return (
            <Button
              onClick={() => handleSubmit('APPROVED')}
              variant="contained"
              color="success"
            // isLoading={isDetailSubmissionLoading || isLoading}
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
    activeTab,
    handleChangeTab,
    renderActionButtons,
  };
};

export default useDetailAccessMenu;
