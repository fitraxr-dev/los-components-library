import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { lpaRequestReview } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBucketChildList from '@/hooks/services/useGetBucketChildList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useSaveBucketDetail from '@/hooks/services/useSaveBucketDetail';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { LpaReviewContext } from '@/components/layouts/LpaReviewLayout/LpaReview.context';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';

import useConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest.hook';
import useGetCurrentModule from '../hooks/useGetCurrentModule';

import useGetReviewDetail from './hooks/useGetReviewDetail';
import useSaveReviewDetail from './hooks/useSaveReviewDetail';
import useUpdateAcknowledge from './hooks/useUpdateAcknowledge';


export const useReview = () => {
  const { viewOnly } = useViewOnly();
  const { processId, debtorId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { parentId }: { parentId: string } = useParams();
  const { module, process } = useGetCurrentModule();
  const [appState] = useApp();
  const stepper = appState.stepper;
  const goToNextStep = useGoToNextStep();
  const [state] = useContext(LpaReviewContext);
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);
  const [lastSubmitPayload, setLastSubmitPayload] = useState<any>(null);

  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const path = usePathname();

  const { data: validateResult } = useGetValidateResult({
    debtorId,
  }, {
    enabled: debtorId !== null && debtorId !== undefined,
  });


  const pathArray = path.split('/');
  const processModule = pathArray[3];

  const theme = useTheme();

  const actionButtons = stepper.steps.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action ?? {};
  const { currentRole } = state;

  const [container, setContainer] = useState(null);
  const [remark, setRemark] = useState(null);
  const initialFormRef = useRef<{ remarks: any; typeSubmission: any } | null>(null);

  const { watch, register, setValue, getValues, reset, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: {
      remarks: '',
      typeSubmission: '',
    },
  });
  const watchFields = watch();
  const { data: typeSubmissionData } = useGetParameterList('typeSubmission');
  const { data: popUp } = useGetParameterList('ccPopUpNeedUrgent');

  const { differencesData } = useConfirmationLatest();

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: processId,
    module,
    process,
  });

  const {
    data: reviewDetail,
    isFetching: isFetchLoading,
  } = useGetReviewDetail({
    bucketProcessId: processId,
    module,
    process,
  });

  // Record activity when review detail is loaded
  useEffect(() => {
    if (reviewDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view lpa review page',
      });
    }
  }, [reviewDetail, processId, module, process, recordActivity]);

  useEffect(() => {
    // If there are differences and user hasn't confirmed, show dpop (old) data
    // Otherwise show current data from debtorInfoData
    let remarksValue = debtorInfoData?.remarks;
    let typeSubmissionValue = debtorInfoData?.typeProcess;

    if (differencesData && Object.keys(differencesData).length > 0) {
      // Check if remarks has changes and use dpop value
      const remarksField = differencesData['remarks'] as any;
      if (remarksField && remarksField.changed === true && remarksField.dpop !== undefined) {
        remarksValue = remarksField.dpop;
      }

      // Check if submissionType has changes and use dpop value
      const submissionTypeField = differencesData['submissionType'] as any;
      if (submissionTypeField && submissionTypeField.changed === true && submissionTypeField.dpop !== undefined) {
        typeSubmissionValue = submissionTypeField.dpop;
      }
    }

    reset({
      remarks: remarksValue,
      typeSubmission: typeSubmissionValue,
    });
    initialFormRef.current = {
      remarks: remarksValue ?? '',
      typeSubmission: typeSubmissionValue ?? '',
    };
  }, [debtorInfoData, differencesData]);

  let isEdit = false;
  const modifiedObject = !viewOnly ? actionButtons : {};

  //function to remove action button in lpa-review
  if (processModule !== 'lpa-review') {
    if (Object.keys(actionButtons).length !== 0) {
      for (const key in actionButtons) {
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
        } else if (key.includes('SAVE')) {
          if (stepper.from !== 'ASK_FOR_INFO') {
            modifiedObject['SAVE'] = 'SAVE';
          }
        } else if (key.includes('EDIT')) {
          isEdit = true;
        } else {
          modifiedObject[key] = actionButtons[key];
        }
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
    'TO_DPOP',
    'TO_DPOP_WITH_CHANGE',
    'SUBMIT',
    'CLOSE'
  ];

  const sortedKeys = sortArray.filter((key) => Object.keys(modifiedObject).includes(key));

  let sortedObject = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
  });

  const isDebtorInvalid = validateResult?.content?.invalid === true && validateResult?.content?.result?.includes('Sedang dilakukan perubahan Data Customer');

  useEffect(() => {
    if (!initialFormRef.current) return;
    const changed =
      (initialFormRef.current.remarks ?? '') !== (watchFields?.remarks ?? '') ||
      (initialFormRef.current.typeSubmission ?? '') !== (watchFields?.typeSubmission ?? '');

    if (changed) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    }
  }, [watchFields?.remarks, watchFields?.typeSubmission, setDirtyMsg]);


  const { data, isLoading } = useGetBucketChildList({
    filter: {
      bucketParent: processId,
      module: module,
      process: process,
    },
    page: {
      itemPerPage: 1,
      noPage: 0,
    },
  } as any);

  // QA Ticket :
  // https://app.asana.com/0/1207753056791819/1208052070640176/f
  // Delete goToNextStep function after onClose save financing and review

  // Save
  const { mutate: saveFinancingOverview } = useSaveBucketDetail({
    onSuccess: () => {
      // Record activity for saving bucket detail
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          remarks: lastSavedPayload?.remarks,
          typeProcess: lastSavedPayload?.typeProcess,
        }),
        changeBefore: JSON.stringify({
          remarks: debtorInfoData?.remarks,
          typeProcess: debtorInfoData?.typeProcess,
        }),
        menuCode: 'lpa-review',
        module: String(module),
        process: String(process),
        remarks: 'successfully saved lpa review bucket detail',
      });

      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({
        onClose: () => {
          if (shouldGoNext) {
            goToNextStep();
          }
        },
        type: 'success',
      });
    },
  });

  const { mutate: updateAcknowledge } = useUpdateAcknowledge({
    onError: () => {
      console.error('Update acknowledge failed');
    },
    onSuccess: () => {
      console.log('Update acknowledge successful');
    },
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveReview } = useSaveReviewDetail({
    onSuccess: async () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      const payload = {
        bucketProcessId: processId,
        module,
        process,
        remarks: watch('remarks'),
        typeFinancing: debtorInfoData.financeType,
        typeProcess: watch('typeSubmission'),
        typeSubmission: watch('typeSubmission'),
      };
      setLastSavedPayload(payload);
      await saveFinancingOverview(payload);
    },
  });


  const { mutate: submitBucket } = useSubmitBucket(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: (data, variables) => {
        // Record activity for submitting bucket
        const activityTypeMap: Record<string, ActivityType> = {
          'APPROVED': ActivityType.APPROVE,
          'CANCELED': ActivityType.REJECT,
          'REJECTED': ActivityType.REJECT,
          'RETURN_TO_MAKER': ActivityType.RETURN_TO_MAKER,
          'SUBMIT': ActivityType.SUBMIT,
        };

        const activityType = activityTypeMap[variables.submitRequestDto.action] || ActivityType.SUBMIT;

        recordActivity({
          activity: activityType,
          bucketProcessId: processId || '',
          changeAfter: JSON.stringify({
            action: lastSubmitPayload?.action,
            comment: lastSubmitPayload?.comment,
          }),
          changeBefore: '',
          menuCode: 'lpa-review',
          module: module,
          process: process,
          remarks: `successfully submitted lpa review with action: ${variables.submitRequestDto.action}`,
        });

        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        showNiceModalV2({
          onClose: () => {
            const pathArr = path.split('/');
            pathArr.splice(-2, 2);
            const url = pathArr.join('/');
            if (variables.submitRequestDto.action !== 'EDIT') {
              router.push(url);
            } else {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }
          },
          title: 'Data berhasil dikirim', type: 'success',
        });
      },
    }
  );

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
            {stepper?.from === 'WAITING_APPROVAL_TL' || stepper?.from === 'WAITING_CHANGE_APPROVAL_TL' ||
              stepper?.from === 'RETURN_TO_TL_CHANGE' || stepper?.from === 'WAITING_CHANGE_APPROVAL_KADIV' ||
              stepper?.from === 'RETURN_TO_TL' ? 'Submit' : 'Approve'}
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
            onClick={() => handleApproveAskForInfo()}
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
            onClick={() => handleNoChange()}
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
      case 'TO_DPOP':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleNotEdit()}
            variant="contained"
            color="warning"
          >
            Approve ask for info
          </Button>
        );
      case 'NEXT':
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleNotEdit()}
            variant="contained"
            color="success"
          >
            Submit
          </Button>
        );
      case 'SAVE':
        return (
          <RowWrapper sx={{ gap: 2 }}>
            <Button
              disabled={isAutoSaveFetching}
              onClick={() => {
                if (processModule === 'lpa-review') {
                  setShouldGoNext(false);
                }
                handleSubmit(handleSaveReview)();
              }}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            {processModule === 'lpa-review' && (
              <Button
                onClick={() => {
                  setShouldGoNext(true);
                  handleSubmit(handleSaveReview)();
                }}
              >
                Next
              </Button>
            )}
          </RowWrapper>
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
          <Button onClick={handleClose}>Close</Button>
        );
      default:
        return (
          <Button
            disabled={isDebtorInvalid}
            onClick={() => handleAskForInfo()}
            variant="contained"
            color="warning"
          >
            Ask for info
          </Button>
        );
    }
  };


  const autoSavePayload = useMemo(() => async () => {

    const description = await convertToDocx(container);

    const formValues = getValues();

    return {
      bucketProcessId: processId,
      description: description,
      module,
      process,
      remarks: formValues.remarks,
      typeFinancing: debtorInfoData?.financeType,
      typeProcess: formValues.typeSubmission,
      typeSubmission: formValues.typeSubmission,
    };
  }, [container, processId, module, process, debtorInfoData, getValues]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'lpa.save.saveReview',
  });


  const handleSaveReview = async (data: any) => {
    const description = await convertToDocx(container);

    if (isDirty || watch('remarks') || watch('typeSubmission')) {
      saveReview({
        bucketProcessId: processId,
        description: description,
        module,
        process,
      });
    } else {
      showNiceModalV2({
        onSubmit() {
          saveReview({
            bucketProcessId: processId,
            description: description,
            module,
            process,
          });
        }, title: 'Tidak ada perubahan ada form ini, apakah anda yakin ingin melanjutkan?', type: 'warning',
      });
    }
  };

  const handleAskForInfo = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        const payload = {
          action: radioValue,
          bucketProcessId: processId,
          comment,
          module,
          process,
        };
        setLastSubmitPayload(payload);
        submitBucket({
          submitRequestDto: payload,
        });
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
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module,
            process,
          },
        });
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
            submitBucket({
              submitRequestDto: {
                action: 'SUBMIT',
                bucketProcessId: data.contents[0].bucketProcessId,
                comment,
                module,
                process: TypeProcess.LPA_REVIEW,
              },
            });
            break;
          default:
            submitBucket({
              submitRequestDto: {
                action: radioValue,
                bucketProcessId: processId,
                comment,
                module,
                process,
              },
            });
            break;
        }
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: [
        { label: 'DPOP', value: 'SUBMIT' },
        {
          label: stepper?.from === 'WAITING_APPROVAL_TL' || stepper?.from === 'WAITING_CHANGE_APPROVAL_TL' ||
            stepper?.from === 'RETURN_TO_TL_CHANGE' || stepper?.from === 'RETURN_TO_TL_ASK_FOR_INFO' ||
            stepper?.from === 'RETURN_TO_TL' || stepper?.from === 'WAITING_ASK_FOR_INFO_TL'
            ? 'Kadiv' : 'TL', value: 'NEXT',
        }
      ],
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
            module,
            process,
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

  const handleNoChange = () => {
    submitBucket({
      submitRequestDto: {
        action: 'NO_CHANGE',
        bucketProcessId: processId,
        module,
        process,
      },
    });
  };

  const handleSubmitData = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        const includeCompleteFlag = stepper?.from === 'WAITING_CHANGE_APPROVAL_KADIV' && action === 'SUBMIT';
        const payload = {
          action: action,
          bucketProcessId: processId,
          comment,
          module,
          process,
          ...(includeCompleteFlag && { isCompleteEditAskForInfo: true }),
        };
        setLastSubmitPayload(payload);
        submitBucket({
          submitRequestDto: payload,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });

  };

  const handleToDpopChange = (value: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        updateAcknowledge({
          bucketProcessId: processId,
          code: parentId,
          module: String(module),
          process: String(process),
        });
        submitBucket({
          submitRequestDto: {
            action: value,
            bucketProcessId: processId,
            comment,
            isCompleteEditAskForInfo: true,
            module: String(module),
            process: String(process),
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleEdit = () => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => { closeNiceModal(MODAL.GLOBAL.CONFIRM); },
      onSubmit: () => {
        submitBucket({
          submitRequestDto: {
            action: 'EDIT',
            bucketProcessId: processId,
            module,
            process,
          },
        });
      },
      title: 'DATA sebelumnya akan dirubah dengan Penerbitan Digital Memo yang baru,apakah anda yakin?',
    });
  };

  const handleClose = () => {
    router.push(lpaRequestReview.BUCKET_LIST);
  };

  const changeBgInput = (inputKey: string) => {
    let color = '#FFFFFF';
    // Map form field names to API response field names
    const fieldMapping: Record<string, string> = {
      'remarks': 'remarks',
      'typeSubmission': 'submissionType',
    };
    const apiFieldName = fieldMapping[inputKey] || inputKey;
    const fieldData = differencesData?.[apiFieldName] as any;
    if (fieldData && fieldData.changed === true) {
      color = '#FCE6E8';
    }
    return color;
  };

  const findDataMaster = (inputKey: string) => {
    let label = '';
    // Map form field names to API response field names
    const fieldMapping: Record<string, string> = {
      'remarks': 'remarks',
      'typeSubmission': 'submissionType',
    };
    const apiFieldName = fieldMapping[inputKey] || inputKey;
    const fieldData = differencesData?.[apiFieldName] as any;
    // Show business (latest) data, not dpop (old) data
    if (fieldData && fieldData.business !== undefined && fieldData.business !== null) {
      label = fieldData.business as string;
    }

    if (inputKey === 'typeSubmission') {
      const submissionTypeMapping: Record<string, string> = {
        'IMMEDIATE': 'Sangat Segera',
        'NORMAL': 'Biasa',
        'QUICK': 'Segera',
      };
      return submissionTypeMapping[label] || label;
    }

    return label;
  };

  const getDataLabel = () => {
    return 'Data Sebelumnya';
  };

  const needCheckMaster = Boolean(
    differencesData &&
    Object.keys(differencesData).length > 0 &&
    Object.keys(differencesData).some((key) =>
      !['jsonDiffSummary', 'lpaDiffs'].includes(key) &&
      (differencesData[key] as any)?.changed === true
    )
  );

  const lpaDiffs = (differencesData?.lpaDiffs as any) || [];

  const [hasShownUrgencyWarning, setHasShownUrgencyWarning] = useState(false);

  const handleShowUrgencyWarning = () => {
    NiceModal.show(MODAL.GLOBAL.WARNING, {
      cancelText: 'Close',
      title: (
        <>
          <p>
            {popUp?.[0]?.label}
          </p>
        </>
      ),
    });
    setHasShownUrgencyWarning(true);
  };

  return {
    changeBgInput,
    container,
    debtorInfoData,
    findDataMaster,
    getDataLabel,
    goToNextStep,
    handleButton,
    handleClose,
    handleEdit,
    handleSaveReview,
    handleShowUrgencyWarning,
    handleSubmit,
    handleSubmitData,
    handleToDpopChange,
    hasShownUrgencyWarning,
    isEdit,
    isFetchLoading,
    isSaveLoading,
    lpaDiffs,
    needCheckMaster,
    processId,
    processModule,
    register,
    remark,
    reviewDetail,
    setContainer,
    setRemark,
    setValue,
    sortedObject,
    stepper,
    theme,
    typeSubmissionData,
    viewOnly,
    watchFields,
  };
};
