import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { technicalStudyReview } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketChildList from '@/hooks/services/useGetBucketChildList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import {
  useTechnicalStudyReviewContext,
} from '@/components/layouts/TechnicalStudyReviewLayout/TechnicalStudyReview.context';
import Button from '@/components/shared/Button';

import useDebtorInformation from '../DebtorInformationPage/DebtorInformation.hook';

import useGetTechnicalReviewRequest from './hooks/useGetTechnicalReviewRequest';
import useSaveTechnicalReviewRequest from './hooks/useSaveTechnicalReviewRequest';

import type { SaveDto } from './hooks/useSaveTechnicalReviewRequest';


export type ActionButtonType =
  | 'DECLINE'
  | 'SUBMIT'
  | 'APPROVE'
  | 'RETURN_TO_STAFF'
  | 'RETURN_TO_TL'
  | 'RETURN_TO_RM'
  | 'EDIT'
  | 'EDIT_ASK_FOR_INFO'
  | 'CANCELED'
  | 'NOT_EDIT_REQ_RETURN_TO_RM'
  | 'SUBMIT_ASK_FOR_INFO'
  | 'NOT_EDIT_REQ_WAITING_APPROVAL_TL'
  | 'APPROVE_ASK_FOR_INFO'
  | 'RETURN_TO_MAKER'
  | 'RETURN_TO_SPECIALIST';

export const useTechnicalReviewRequest = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');
  const [container, setContainer] = useState<any>(null);
  const [state] = useApp();
  const { viewOnly: isViewOnly } = state;
  const router = useCustomRouter();
  const path = usePathname();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);
  const [lastSubmitPayload, setLastSubmitPayload] = useState<any>(null);

  const { validateResult } = useDebtorInformation();
  const { data: typeSubmissionData } = useGetParameterList('typeSubmission');
  const { stepper } = useTechnicalStudyReviewContext();
  const actionButtons = stepper?.steps?.[1]?.action;
  const buttonListTemplateByKey = [
    'APPROVE',
    'DECLINE',
    'RETURN_TO_RM',
    'RETURN_TO_MAKER',
    'SUBMIT',
  ];

  const { data } = useGetBucketChildList({
    filter: ({
      bucketParent: processId,
      module: state.pages.module,
      process: state.pages.process,
    } as any),
    page: {
      itemPerPage: 0,
      noPage: 0,
    },
  } as any);

  const {
    data: technicalReviewDetail,
    isFetching: isFetchLoading,
    isSuccess: isFetchRequestDetailSuccess,
  } = useGetTechnicalReviewRequest({
    bucketProcess: processId,
  } as any);

  // Record activity when technical review request detail is loaded
  useEffect(() => {
    if (technicalReviewDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: state.pages.module,
        process: state.pages.process,
        remarks: 'view technical review request page',
      });
    }
  }, [technicalReviewDetail, processId, state.pages.module, state.pages.process, recordActivity]);

  const queryClient = useQueryClient();

  const { mutate: saveTechnicalReviewRequest } = useSaveTechnicalReviewRequest({
    onSuccess: () => {
      // Record activity for saving technical review request
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          additionalInformation: 'updated',
          notes: lastSavedPayload?.notes,
          type: lastSavedPayload?.type,
        }),
        changeBefore: JSON.stringify({
          notes: technicalReviewDetail?.notes,
          type: technicalReviewDetail?.type,
        }),
        menuCode: 'technical-study-review',
        module: state.pages.module,
        process: state.pages.process,
        remarks: 'successfully saved technical review request data',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose() {
          queryClient.invalidateQueries({
            queryKey: [
              'technical-review-request',
              {
                bucketProcess: processId,
                module: state.pages.module,
                process: state.pages.process,
              },
            ],
          });
          queryClient.invalidateQueries({
            queryKey: ['bucket-stepper', { bucketProcessId: processId }],
          });
        },
        type: 'success',
      });
    },
  });

  useEffect(() => {
    setDirtyMsg(undefined);

    if (isFetchRequestDetailSuccess) {
      if (technicalReviewDetail?.notes?.length > 0) {
        setNotes(technicalReviewDetail.notes);
      }
      if (technicalReviewDetail?.type?.length > 0) {
        setType(technicalReviewDetail.type);
      }
    }
  }, [technicalReviewDetail, isFetchRequestDetailSuccess]);

  const autoSavePayload = useMemo(() => async () => {

    const blob = container ? await convertToDocx(container) : null;

    return {
      additionalInformation: blob,
      bucketProcess: processId,
      module: state.pages.module,
      notes: notes,
      process: state.pages.process,
      type: type,
    };
  }, [container, processId, state.pages.module, state.pages.process, notes, type]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !isViewOnly,
    payload: autoSavePayload,
    url: 'technicalReview.add.save',
  });

  const handleSave = (blob) => {
    const payload: SaveDto = {
      additionalInformation: blob,
      bucketProcess: processId,
      module: state.pages.module,
      notes: notes,
      process: state.pages.process,
      type: type,
    };

    setLastSavedPayload(payload);
    saveTechnicalReviewRequest(payload);
  };

  const { mutate: submitTechnicalReviewRequest, isPending: isSubmitLoading } =
    useSubmitBucket({
      onError: () => {
        showNiceModalV2({
          title: 'Terjadi kesalahan, silahkan dicoba lagi',
          type: 'error',
        });
      },
      onSuccess: (data, variables) => {
        // Record activity for submitting technical review request
        const action = variables.submitRequestDto.action;
        const activityType = action === 'CANCELED' || action === 'REJECTED'
          ? ActivityType.REJECT
          : action === 'RETURN_TO_SPECIALIST' || action === 'RETURN_TO_TL' || action === 'RETURN_TO_STAFF'
            ? ActivityType.RETURN_TO_MAKER
            : action === 'EDIT'
              ? ActivityType.EDIT
              : ActivityType.SUBMIT;

        recordActivity({
          activity: activityType,
          bucketProcessId: processId || '',
          changeAfter: JSON.stringify({
            action: action,
            comment: variables.submitRequestDto.comment,
          }),
          changeBefore: '',
          menuCode: 'technical-study-review',
          module: state.pages.module,
          process: state.pages.process,
          remarks: `successfully ${action?.toLowerCase() || 'submitted'} technical review request`,
        });

        showNiceModalV2({
          onClose: () => {
            queryClient.invalidateQueries({
              queryKey: ['bucket-stepper', { bucketProcessId: processId }],
            });
            const url = replacePath(technicalStudyReview.REQUEST_PAGE, {});
            router.push(variables.submitRequestDto.action === 'EDIT' ? path : url);
          },
          title: 'Data berhasil dikirim',
          type: 'success',
        });
      },
    });

  const handleDecline = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        closeNiceModal(MODAL.GLOBAL.COMMENT);
        const payload = {
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: state.pages.module,
            process: state.pages.process,
          },
        };
        setLastSubmitPayload(payload.submitRequestDto);
        submitTechnicalReviewRequest(payload);
      },
      radioLabel: 'Declined',
      radioOptions: [
        { label: 'Cancelled', value: 'CANCELED' },
        { label: 'Rejected', value: 'REJECTED' },
      ],
    });
  };

  const handleActionButton = (type: ActionButtonType, from?: string) => {
    let action: string;
    let process;
    let buttonContents = [] as any[];
    if (!actionButtons || JSON.stringify(actionButtons) === '{}') {
      return;
    }

    for (const key in actionButtons) {
      if (buttonListTemplateByKey.includes(key)) {
        const indexByKeyInTemplate = buttonListTemplateByKey.indexOf(key);
        buttonContents[indexByKeyInTemplate] = [key, actionButtons[key]];
      }
    }

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        closeNiceModal(MODAL.GLOBAL.COMMENT);
        if (type === 'EDIT_ASK_FOR_INFO' || type === 'SUBMIT_ASK_FOR_INFO' || type === 'APPROVE_ASK_FOR_INFO' || (type === 'SUBMIT' && actionButtons?.SUBMIT === 'EDIT_ASK_FOR_INFO')) {
          action = radioValue;
        } else {
          action = type;
        }

        const payload = {
          submitRequestDto: {
            action,
            bucketProcessId: process ? process : processId,
            comment,
            module: state.pages.module,
            process: state.pages.process,
            ...((stepper?.from === 'EDIT_REQ_WAITING_APPROVAL_KADIV' || type === 'APPROVE_ASK_FOR_INFO') && action === 'SUBMIT' ? { isCompleteEditAskForInfo: true } : {}),
          },
        };
        setLastSubmitPayload(payload.submitRequestDto);
        submitTechnicalReviewRequest(payload);
      },
      ...(() => {
        let modalConfig = {} as any;

        // Handle Approve Ask For Info case
        if (type === 'APPROVE_ASK_FOR_INFO') {
          modalConfig = {
            radioLabel: 'Forward to: ',
            radioOptions: [
              { label: 'DELST-TEKNIS', value: 'RETURN_TO_SPECIALIST' },
              { label: 'KADIV', value: 'NOT_EDIT_REQ_WAITING_APPROVAL_KADIV' },
            ],
          };
        } else {
          buttonContents.map((button) => {
            const [key, detail] = button as any;
            if (type === 'SUBMIT' && detail === 'EDIT_ASK_FOR_INFO') {
              modalConfig = {
                radioLabel: 'Forward to: ',
                radioOptions: [
                  { label: 'DELST-TEKNIS', value: 'RETURN_TO_SPECIALIST' },
                  { label: 'TL', value: 'NOT_EDIT_REQ_WAITING_APPROVAL_TL' },
                ],
              };
            } else if (type === 'EDIT_ASK_FOR_INFO' && detail === 'EDIT_ASK_FOR_INFO') {
              modalConfig = {
                radioLabel: 'Forward to: ',
                radioOptions: [
                  { label: 'DELST-TEKNIS', value: 'RETURN_TO_SPECIALIST' },
                  { label: 'TL', value: 'NOT_EDIT_REQ_WAITING_APPROVAL_TL' },
                ],
              };
            } else if (detail === 'SUBMIT_ASK_FOR_INFO' && type === 'SUBMIT_ASK_FOR_INFO') {
              modalConfig = {
                radioLabel: 'Forward to: ',
                radioOptions: [
                  { label: 'DELST', value: 'RETURN_TO_SPECIALIST' },
                  { label: 'KADIV', value: 'SUBMIT' },
                ],
              };
            }
          });
        }
        return modalConfig;
      })(),
    });
  };

  const handleEdit = () => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => {
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      onSubmit: () => {
        const payload = {
          submitRequestDto: {
            action: 'EDIT',
            bucketProcessId: processId,
            module: state.pages.module,
            process: state.pages.process,
          },
        };
        setLastSubmitPayload(payload.submitRequestDto);
        submitTechnicalReviewRequest(payload);
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      title: 'Apakah anda yakin ingin melakukan perubahan ?',
    });
  };

  let isEdit = false;
  const modifiedObject: Record<string, string> = !isViewOnly ? { SAVE: 'SAVE' } : {};
  if (actionButtons && Object.keys(actionButtons).length !== 0) {
    for (const key in actionButtons) {
      if (key.includes('CANCEL') || key.includes('REJECT')) {
        modifiedObject['DECLINE'] = 'DECLINE';
      } else if (key.includes('SUBMIT')) {
        modifiedObject['SUBMIT'] = 'SUBMIT';
      } else if (key.includes('RETURN_TO_RM')) {
        modifiedObject['RETURN_TO_RM'] = actionButtons[key];
      } else if (key.includes('RETURN_TO_TL')) {
        modifiedObject['RETURN_TO_TL'] = 'RETURN_TO_TL';
      } else if (key.includes('APPROVE')) {
        modifiedObject['APPROVE'] = 'APPROVE';
      } else if (key.includes('RETURN_TO_MAKER')) {
        modifiedObject['RETURN_TO_MAKER'] = 'RETURN_TO_MAKER';
      } else if (key.includes('EDIT')) {
        isEdit = true;
      } else {
        modifiedObject[key] = actionButtons[key];
      }
    }
  }

  const sortArray = [
    'DECLINE',
    'SAVE',
    'RETURN_TO_RM',
    'RETURN_TO_MAKER',
    'RETURN_TO_TL',
    'APPROVE',
    'SUBMIT',
  ];
  const sortedKeys = sortArray.filter((key) => Object.keys(modifiedObject).includes(key));
  const sortedObject: Record<string, string> = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
  });

  const isDebtorInvalid = validateResult?.content?.invalid === true && validateResult?.content?.result?.includes('Sedang dilakukan perubahan Data Customer');

  const handleButton = (key: string, value: string) => {
    switch (key) {
      case 'DECLINE':
        return (
          <Button
            onClick={handleDecline}
            variant="outlined"
            color="error"
          >
            Decline
          </Button>
        );
      case 'SAVE':
        return (
          <Button
            color="primary"
            variant="contained"
            disabled={isViewOnly || isAutoSaveFetching}
            onClick={() => {
              convertToDocx(container).then(handleSave);
            }}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        );
      case 'SUBMIT':
        return (
          <Button
            disabled={stepper?.progress < 100 || isDebtorInvalid}
            onClick={() => handleActionButton('SUBMIT')}
            variant="contained"
            color="success"
          >
            Submit
          </Button>
        );
      case 'RETURN_TO_RM':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleActionButton(value as ActionButtonType)}
            variant="contained"
            color="darkBlue"
          >
            Return to Staff
          </Button>
        );
      case 'RETURN_TO_MAKER':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleActionButton('RETURN_TO_MAKER')}
            variant="contained"
            color="darkBlue"
          >
            Return to Maker
          </Button>
        );
      case 'RETURN_TO_TL':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleActionButton('RETURN_TO_TL')}
            variant="contained"
            color="info"
          >
            Return to TL
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => {
              if (stepper?.from === 'NOT_EDIT_REQ_WAITING_APPROVAL_TL' || stepper?.from === 'NOT_EDIT_REQ_RETURN_TO_TL') {
                handleActionButton('APPROVE_ASK_FOR_INFO');
              } else if (stepper?.from === 'NOT_EDIT_REQ_WAITING_APPROVAL_KADIV') {
                handleActionButton('RETURN_TO_SPECIALIST');
              } else {
                handleActionButton('SUBMIT');
              }
            }}
            variant="contained"
            {...(stepper?.from === 'NOT_EDIT_REQ_WAITING_APPROVAL_TL' || stepper?.from === 'NOT_EDIT_REQ_WAITING_APPROVAL_KADIV' || stepper?.from === 'NOT_EDIT_REQ_RETURN_TO_TL'
              ? { color: 'warning' }
              : { color: 'success' })}
          >
            {stepper?.from === 'NOT_EDIT_REQ_WAITING_APPROVAL_TL' || stepper?.from === 'NOT_EDIT_REQ_WAITING_APPROVAL_KADIV' || stepper?.from === 'NOT_EDIT_REQ_RETURN_TO_TL'
              ? 'Approve Ask For Info'
              : stepper?.from === 'WAITING_APPROVAL_TL' || stepper?.from === 'EDIT_REQ_WAITING_APPROVAL_TL' || stepper?.from === 'RETURN_TO_TL'
                ? 'Submit'
                : 'Approve'}
          </Button>
        );
      default:
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleActionButton(value as ActionButtonType)}
            variant="contained"
          >
            {key}
          </Button>
        );
    }
  };

  return {
    container,
    handleActionButton,
    handleButton,
    handleDecline,
    handleEdit,
    handleSave,
    isEdit,
    isFetchLoading,
    isSubmitLoading,
    isViewOnly,
    notes,
    setContainer,
    setNotes,
    setType,
    sortedObject,
    technicalReviewDetail,
    type,
    typeSubmissionData,
  };
};
