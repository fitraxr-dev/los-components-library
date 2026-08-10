import { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { lpaReview } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketChildList from '@/hooks/services/useGetBucketChildList';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { LpaReviewContext } from '@/components/layouts/LpaReviewLayout/LpaReview.context';
import Button from '@/components/shared/Button';

import useGetCurrentModule from '../hooks/useGetCurrentModule';

import useGetRecommendation from './hooks/useGetRecommendation';
import useSaveRecommendation from './hooks/useSaveRecommendation';
import useUpdateAcknowledge from './hooks/useUpdateAcknowledge';


const useRecommendation = () => {
  const { viewOnly } = useViewOnly();
  const { processId, debtorId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [container, setContainer] = useState(null);
  const { setDirtyMsg } = useContext(DirtyContext);
  const { module, process } = useGetCurrentModule();
  const { parentId }: { parentId: string } = useParams();
  const path = usePathname();
  const router = useRouter();
  const [state] = useContext(LpaReviewContext);
  const { currentRole } = state;
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);
  const [lastSubmitPayload, setLastSubmitPayload] = useState<any>(null);

  const [appState] = useApp();

  const stepper = appState.stepper;
  const actionButtons = stepper.steps.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action ?? {};

  const modifiedObject = !viewOnly ? { SAVE: 'SAVE' } : {};

  const queryClient = useQueryClient();

  const { data: validateResult } = useGetValidateResult({
    debtorId,
  }, {
    enabled: debtorId !== null && debtorId !== undefined,
  });

  const isDebtorInvalid = validateResult?.content?.invalid === true && validateResult?.content?.result?.includes('Sedang dilakukan perubahan Data Customer');

  //function to remove action button in lpa-review

  if (Object.keys(actionButtons).length !== 0) {
    for (const key in actionButtons) {
      if (key.includes('TABLE_UPLOAD_DOCUMENT_DELETE') || key.includes('TABLE_UPLOAD_DOCUMENT_EDIT') || key.includes('TABLE_UPLOAD_DOCUMENT_DOWNLOAD')) {

      }
      if (key.includes('APPROVE_ASK_FOR_INFO')) {
        if (actionButtons['APPROVE_ASK_FOR_INFO_BUSINESS']) {
          modifiedObject['APPROVE_ASK_FOR_INFO_MODAL'] = 'APPROVE_ASK_FOR_INFO_MODAL';
        } else {
          modifiedObject['APPROVE_ASK_FOR_INFO'] = actionButtons['APPROVE_ASK_FOR_INFO'];
        }
      } else if (key.includes('ASK_FOR_INFO_TL') || key.includes('ASK_FOR_INFO_BUSINESS')) {
        modifiedObject['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
      } else if (key.includes('CANCEL') || key.includes('REJECT')) {
        modifiedObject['DECLINE'] = 'DECLINE';
      } else if (key.includes('TO_DPOP_WITH_CHANGE')) {
        modifiedObject['TO_DPOP_WITH_CHANGE'] = 'SUBMIT';
      } else if (key.includes('TO_DPOP')) {
        modifiedObject['NEXT'] = 'NEXT';
      } else {
        modifiedObject[key] = actionButtons[key];
      }
    }
  }

  const sortArray = [
    'DECLINE',
    'SAVE',
    'RETURN_TO_STAFF',
    'RETURN_TO_TL',
    'APPROVE_ASK_FOR_INFO',
    'APPROVE_ASK_FOR_INFO_MODAL',
    'ASK_FOR_INFO',
    'APPROVE',
    'NEXT',
    'TO_DPOP_WITH_CHANGE',
    'SUBMIT',
    'CLOSE'
  ];

  const sortedKeys = sortArray.filter((key) => Object.keys(modifiedObject).includes(key));

  let sortedObject = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
  });

  const { data, isLoading } = useGetRecommendation({
    bucketProcessId: processId,
    module,
    process,
  });

  // Record activity when recommendation page is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view lpa review recommendation page',
      });
    }
  }, [data, processId, module, process, recordActivity]);

  const goToBucket = () => {
    router.push(lpaReview.REQUEST);
  };

  const { mutate, isPending } = useSaveRecommendation({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for saving recommendation
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          description: 'updated',
        }),
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully saved lpa review recommendation',
      });

      setDirtyMsg(undefined);

      showNiceModalV2({
        title: 'Data Berhasil Di simpan', type: 'success',
      });
    },
  });

  const handleSaveRecommendation = async (description: any) => {
    const document = await convertToDocx(description);

    if (viewOnly) {
      goToBucket();
    } else {
      mutate({
        bucketProcessId: processId,
        description: document,
        module,
        process,
      });
    }
  };

  const { data: bcmData } = useGetBucketChildList({
    filter: {
      bucketParent: processId,
      module,
      process,
    },
    page: {
      itemPerPage: 1,
      noPage: 0,
    },
  });


  const { mutate: submitBucket } = useSubmitBucket(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        // Record activity for submitting recommendation
        const action = lastSubmitPayload?.action;
        const activityType = action === 'CANCELED' || action === 'REJECTED'
          ? ActivityType.REJECT
          : action?.includes('RETURN_TO')
            ? ActivityType.RETURN_TO_MAKER
            : action === 'NO_CHANGE'
              ? ActivityType.SUBMIT
              : ActivityType.SUBMIT;

        recordActivity({
          activity: activityType,
          bucketProcessId: lastSubmitPayload?.bucketProcessId || '',
          changeAfter: JSON.stringify({
            action: action,
            comment: lastSubmitPayload?.comment,
          }),
          changeBefore: '',
          menuCode: 'lpa-review',
          module: module,
          process: process,
          remarks: `successfully ${action?.toLowerCase() || 'submitted'} lpa review recommendation`,
        });

        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        showNiceModalV2({
          onClose: () => {
            const pathArr = path.split('/');
            pathArr.splice(-2, 2);
            const url = pathArr.join('/');
            router.push(url);;
          },
          title: 'Data berhasil dikirim', type: 'success',
        });
      },
    }
  );

  const { mutate: updateAcknowledge } = useUpdateAcknowledge({
    onError: () => {
      console.error('Update acknowledge failed');
    },
    onSuccess: () => {
      console.log('Update acknowledge successful');
    },
  });

  const handleButton = (key: string, value: string) => {
    switch (key) {
      case 'SUBMIT':
        return (
          <Button
            disabled={stepper.progress < 100 || isDebtorInvalid}
            onClick={() => handleSubmitData(value)}
            variant="contained"
            color="success"
          >
            Submit
          </Button>
        );
      case 'RETURN_TO_STAFF':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleSubmitData(value)}
            variant="contained"
          >
            Return to Staff
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleSubmitData(value)}
            variant="contained"
            color="success"
          >
            {stepper?.from === 'REV_WAITING_APPROVAL_TL' ? 'Submit' : 'Approve'}
          </Button>
        );
      case 'RETURN_TO_TL':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleSubmitData(value)}
            variant="contained"
            color="info"
          >
            Return to TL
          </Button>
        );
      case 'APPROVE_ASK_FOR_INFO':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleSubmitData(value)}
            variant="contained"
            color="warning"
          >
            Approve ask for info
          </Button>
        );
      case 'APPROVE_ASK_FOR_INFO_MODAL':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={handleApproveAskForInfo}
            variant="contained"
            color="warning"
          >
            Approve ask for info
          </Button>
        );
      case 'NO_CHANGE':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={handleNoChange}
            variant="contained"
          >
            No Changes
          </Button>
        );
      case 'DECLINE':
        return (
          <Button
            onClick={handleRejectCollaboration}
            variant="outlined"
            color="error"
          >
            Decline
          </Button>
        );
      case 'NEXT':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={handleNotEdit}
            variant="contained"
            color="success"
          >
            Submit
          </Button>
        );
      case 'SAVE':
        return (
          <Button
            isLoading={isPending}
            onClick={() => {
              handleSaveRecommendation(container);
            }}
          >
            Save
          </Button>
        );
      case 'TO_DPOP_WITH_CHANGE':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleToDpopChange(value)}
            variant="contained"
            color="success"
          >
            Approve
          </Button>
        );
      case 'CLOSE':
        return (
          <Button onClick={handleClose} >
            Close
          </Button>
        );
      default:
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={handleAskForInfo}
            variant="contained"
            color="warning"
          >
            Ask for info
          </Button>
        );
    }
  };

  const handleAskForInfo = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        if (radioValue === 'ASK_FOR_INFO_BUSINESS') {
          updateAcknowledge({ bucketProcessId: processId, code: parentId,
            module: String(module), process: String(process) });
        }
        const payload = {
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module,
            process,
          },
        };
        setLastSubmitPayload(payload.submitRequestDto);
        submitBucket(payload);
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: [
        { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
        { label: 'TL', value: 'ASK_FOR_INFO_TL' }
      ],
    });
  };

  const handleApproveAskForInfo = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        const payload = {
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module,
            process,
          },
        };
        setLastSubmitPayload(payload.submitRequestDto);
        submitBucket(payload);
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: [
        { label: 'Kadiv', value: 'SUBMIT' },
        { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' }
      ],
    });
  };

  const handleNotEdit = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        switch (radioValue) {
          case 'SUBMIT':
            const submitPayload = {
              submitRequestDto: {
                action: 'SUBMIT',
                bucketProcessId: bcmData.contents[0].bucketProcessId,
                comment,
                module,
                process: TypeProcess.LPA_REVIEW,
              },
            };
            setLastSubmitPayload(submitPayload.submitRequestDto);
            submitBucket(submitPayload);
            break;
          default:
            const defaultPayload = {
              submitRequestDto: {
                action: radioValue,
                bucketProcessId: processId,
                comment,
                module,
                process,
              },
            };
            setLastSubmitPayload(defaultPayload.submitRequestDto);
            submitBucket(defaultPayload);
            break;
        }
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: [
        { label: 'DPOP', value: 'SUBMIT' },
        { label: currentRole.includes(roles.TL) ? 'Kadiv' : 'TL', value: 'NEXT' }
      ],
    });
  };


  const handleRejectCollaboration = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        const payload = {
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module,
            process,
          },
        };
        setLastSubmitPayload(payload.submitRequestDto);
        submitBucket(payload);
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Choose Reason:',
      radioOptions: [
        { label: 'Cancel', value: 'CANCELED' },
        { label: 'Reject', value: 'REJECTED' }
      ],
    });
  };

  const handleNoChange = () => {
    const payload = {
      submitRequestDto: {
        action: 'NO_CHANGE',
        bucketProcessId: processId,
        module,
        process,
      },
    };
    setLastSubmitPayload(payload.submitRequestDto);
    submitBucket(payload);
  };

  const handleSubmitData = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        const payload = {
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module,
            process,
          },
        };
        setLastSubmitPayload(payload.submitRequestDto);
        submitBucket(payload);
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleToDpopChange = (value: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        const payload = {
          submitRequestDto: {
            action: value,
            bucketProcessId: bcmData.contents[0].bucketProcessId,
            comment,
            isCompleteEditAskForInfo: true,
            module: bcmData.contents[0].module,
            process: bcmData.contents[0].process,
          },
        };
        setLastSubmitPayload(payload.submitRequestDto);
        submitBucket(payload);
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const renderActionButtons = () => {
    return sortedObject ? Object.entries(sortedObject).map((dt: [string, string], index: number) => {
      return (handleButton(dt[0], dt[1]));
    }) : null;
  };

  const handleClose = () => {
    router.push(lpaReview.ASSIGNMENT);
  };
  return {
    container,
    data,
    handleSaveRecommendation,
    isLoading,
    isPending,
    module,
    mutate,
    process,
    renderActionButtons,
    setContainer,
    viewOnly,
  };
};

export default useRecommendation;
