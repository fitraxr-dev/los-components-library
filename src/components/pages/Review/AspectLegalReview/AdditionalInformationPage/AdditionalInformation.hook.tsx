import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { ASPECT_LEGAL_REVIEW } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { AspectLegalReviewContext } from '@/components/layouts/AspectLegalReviewLayout/AspectLegalReview.context';
import Button from '@/components/shared/Button';

import { useLegalAspectAccess } from '../hooks/useLegalAspectAccess';

import { ListSuccessSubmit } from './AdditionalInformation.constants';
import useGetAdditionalInformationById from './hooks/useGetAdditionalInformationById';
import useSaveAdditionalInformation from './hooks/useSaveAdditionalInformation';


export const useAdditionalInformation = () => {
  const { processId }: { processId: string } = useParams();
  const [{ currentRole, stepper }] = useApp();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [isIconEdit, setIsIconEdit] = useState<boolean>(false);
  const { viewOnly } = useViewOnly();
  const [appState] = useApp();
  const path = usePathname();
  const { goToNextStep, state: aspectLegalReviewState } = useContext(AspectLegalReviewContext);
  const actionButtons = aspectLegalReviewState?.actionButtons;
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const isTL = currentRole?.includes(roles.TL);
  const isStaff = appState?.currentRole?.includes(roles.RM);
  const isMaker = appState?.currentRole?.includes(roles.MAKER);
  const { recordActivity } = useRecordLog();
  const [containerAdditionalInformation, setContainer] = useState(null);
  const { redirectToFromPage } = useNavigationFromPage();

  const {
    hasAnyCreateAccess: canCreateAdditionalInfo,
    hasAnyUpdateAccess: canUpdateAdditionalInfo,
  } = useLegalAspectAccess();

  const formattedActionButton = {};
  let isEdit = false;

  for (const key in actionButtons) {
    if (key === 'ASK_FOR_INFO' && canUpdateAdditionalInfo) {
      formattedActionButton['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else if (key === 'APPROVE_ASK_FOR_INFO' && canUpdateAdditionalInfo) {
      formattedActionButton['APPROVE_ASK_FOR_INFO'] = actionButtons[key];
    } else if (key === 'SUBMIT_ASK_FOR_INFO_MODAL' && canUpdateAdditionalInfo) {
      formattedActionButton['SUBMIT_ASK_FOR_INFO_MODAL'] = actionButtons[key];
    } else if (key.includes('EDIT') && canUpdateAdditionalInfo) {
      isEdit = true;
    } else if (key === 'SUBMIT' && canUpdateAdditionalInfo) {
      formattedActionButton[key] = actionButtons[key];
    } else if (key === 'APPROVE' && canUpdateAdditionalInfo) {
      formattedActionButton[key] = actionButtons[key];
    } else if (key === 'RETURN_TO_STAFF' && canUpdateAdditionalInfo) {
      formattedActionButton[key] = actionButtons[key];
    } else if (key === 'RETURN_TO_TL' && canUpdateAdditionalInfo) {
      formattedActionButton[key] = actionButtons[key];
    } else if (key === 'RETURN_TO_MAKER' && canUpdateAdditionalInfo) {
      formattedActionButton[key] = actionButtons[key];
    } else if (key === 'NO_CHANGE' && canUpdateAdditionalInfo) {
      formattedActionButton[key] = actionButtons[key];
    }
  }


  const formatRadioBtn = () => {
    let radioButtons = [
      { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
      { label: isMaker ? 'Checker' : 'TL', value: isMaker ? 'ASK_FOR_INFO_CHECKER' : 'ASK_FOR_INFO_TL' }
    ];
    if (appState?.currentRole?.includes(roles.TL)) {
      radioButtons = [
        { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
        { label: 'Kadiv', value: 'SUBMIT' }
      ];
    }
    return radioButtons;
  };


  const {
    data: additionalInformationDetail,
    isFetching: isFetchLoading,
  } = useGetAdditionalInformationById({
    bucketProcessId: String(processId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DH,
  });


  useEffect(() => {
    if (additionalInformationDetail && !isFetchLoading) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DH,
        remarks: 'view additional information detail page',
      });
    }
  }, [additionalInformationDetail, isFetchLoading, processId, recordActivity]);

  const { isPending: isSaveLoading, mutate: saveAdditionalInformation } = useSaveAdditionalInformation();


  const { mutate: submitBucket } = useSubmitBucket({
    onError: (error) => {
      const errorMessage = error?.message;
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: (data, variables) => {
      const action = variables.submitRequestDto.action;
      let activityType = ActivityType.SUBMIT;
      let remarks = 'submit additional information';

      if (action === ActivityType.APPROVE || action.includes(ActivityType.APPROVE)) {
        activityType = ActivityType.APPROVE;
        remarks = 'approve additional information';
      } else if (action === ActivityType.RETURN_TO_STAFF || action === ActivityType.RETURN_TO_TL) {
        activityType = ActivityType.REJECT;
        remarks = `reject and return additional information (${action})`;
      } else if (action === ActivityType.NO_CHANGE) {
        activityType = ActivityType.SUBMIT;
        remarks = 'submit additional information with no change';
      } else if (action.includes(ActivityType.ASK_FOR_INFO)) {
        activityType = ActivityType.SUBMIT;
        remarks = `ask for information: ${action}`;
      }

      recordActivity({
        activity: activityType,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(variables),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DH,
        remarks: remarks,
      });

      queryClient.invalidateQueries({ queryKey: ['bucket-list']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      if (action === 'EDIT') {
        showNiceModalV2({
          title: '',
          type: 'success',
        });
        window.location.reload();
      } else {
        showNiceModalV2({
          onClose: () => handleBackToTable(),
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      }
    },
  });

  const handleBackToTable = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      remarks: 'close additional information page',
    });
    if (redirectToFromPage()) return;
    const pathModule = path?.split('/')[4];
    ListSuccessSubmit.filter((item) => {
      if ((appState?.currentRole?.includes(item.role) && item.module === pathModule) && !isIconEdit) {
        router.replace(item.url);
      }
    });
  };

  const handleSaveAdditionalInfo = (blob: Blob) => {
    if (viewOnly || !canUpdateAdditionalInfo) {
      if (viewOnly) {
        goToNextStep();
      }
      return;
    }

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      remarks: 'initiate save additional information',
    });

    saveAdditionalInformation({
      bucketProcessId: String(processId),
      description: blob,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
    }, {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: (data) => {
        recordActivity({
          activity: isIconEdit ? ActivityType.EDIT : ActivityType.ADD,
          bucketProcessId: processId,
          changeAfter: JSON.stringify(data),
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DH,
          remarks: isIconEdit ? 'edit additional information' : 'add additional information',
        });

        // Reset dirty state
        setDirtyMsg(undefined);
        queryClient.invalidateQueries({ queryKey: ['mip-additional-information', { bucketProcessId: processId }]});
        queryClient.invalidateQueries({ queryKey: ['dh-additional-information', { bucketProcessId: processId }]});
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        // Show modal
        showNiceModalV2({ title: 'Additional information berhasil disimpan', type: 'success' });
      },
    });
  };

  const saveThenOpenComment = async (action: string) => {
    if (viewOnly || !canUpdateAdditionalInfo) {
      if (viewOnly) goToNextStep();
      return;
    }

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      remarks: `initiate save before action: ${action}`,
    });

    try {
      const blob = await convertToDocx(containerAdditionalInformation);

      saveAdditionalInformation({
        bucketProcessId: String(processId),
        description: blob,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DH,
      }, {
        onError: () => {
          showNiceModalV2({
            title: 'Data Gagal disimpan',
            type: 'error',
          });
        },
        onSuccess: (data) => {
          recordActivity({
            activity: isIconEdit ? ActivityType.EDIT : ActivityType.ADD,
            bucketProcessId: processId,
            changeAfter: JSON.stringify(data),
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DH,
            remarks: isIconEdit ? 'edit additional information (save before submit)' : 'add additional information (save before submit)',
          });

          setDirtyMsg(undefined);
          queryClient.invalidateQueries({ queryKey: ['mip-additional-information', { bucketProcessId: processId }]});
          queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});

          NiceModal.show(MODAL.GLOBAL.COMMENT, {
            onSave: ({ comment }) => {
              submitBucket({
                submitRequestDto: {
                  action: action,
                  bucketProcessId: processId,
                  comment,
                  module: TypeModule.MIP_REVIEW,
                  process: TypeProcess.REVIEWER_DH,
                },
              });
              closeNiceModal(MODAL.GLOBAL.COMMENT);
            },
          });
        },
      });
    } catch (error) {
      showNiceModalV2({
        title: 'Gagal mengkonversi dokumen. Silakan coba lagi',
        type: 'error',
      });
    }
  };

  const handleSubmit = (action: string) => {
    if (!canUpdateAdditionalInfo) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      remarks: `open submit modal for action: ${action}`,
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DH,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleNoChange = () => {
    if (!canUpdateAdditionalInfo) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      remarks: 'initiate no change action',
    });
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: ActivityType.NO_CHANGE,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DH,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleAskForInfo = () => {
    if (!canUpdateAdditionalInfo) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      remarks: 'open ask for info modal',
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DH,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: formatRadioBtn(),
    });
  };

  const handleClose = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      remarks: 'close additional information page',
    });
    router.push(ASPECT_LEGAL_REVIEW.ASSIGNMENT_PAGE);
  };

  let AskForInfoBtnLabel = isTL ? 'Submit Ask For Info' : 'Ask For Info';
  const handleButton = (key: string, value: string) => {
    if (!canUpdateAdditionalInfo) return null;

    const isProgressComplete = stepper?.progress === 100;

    switch (key) {
      case 'SUBMIT':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="success"
            disabled={!isProgressComplete}
          >
            Submit
          </Button>
        );
      case 'RETURN_TO_STAFF':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="darkBlue"
          >
            Return to Staff
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="success"
          >
            Approve
          </Button>
        );
      case 'RETURN_TO_MAKER':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="info"
          >
            Return to Maker
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
      case 'APPROVE_ASK_FOR_INFO':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="warning"
          >
            Approve ask for info
          </Button>
        );
      case 'SUBMIT_ASK_FOR_INFO':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="warning"
          >
            Submit ask for info
          </Button>
        );
      case 'APPROVE_ASK_FOR_INFO_MODAL':
        return (
          <Button
            onClick={handleAskForInfo}
            variant="contained"
            color="warning"
          >
            Approve ask for info
          </Button>
        );
      case 'SUBMIT_ASK_FOR_INFO_MODAL':
        return (
          <Button
            onClick={handleAskForInfo}
            variant="contained"
            color="warning"
          >
            Submit ask for info
          </Button>
        );
      case 'NO_CHANGE':
        return (
          <Button
            onClick={() => handleNoChange()}
            variant="contained"
            color="orange"
          >
            No Changes
          </Button>
        );

      default:
        return (
          <Button
            onClick={handleAskForInfo}
            variant="contained"
            color="warning"
          >
            {AskForInfoBtnLabel}
          </Button>
        );
    }
  };

  const handleEdit = () => {
    if (!canUpdateAdditionalInfo) return;

    setIsIconEdit(true);

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      remarks: 'open edit confirmation modal',
    });

    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => {
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      onSubmit: () => {
        recordActivity({
          activity: ActivityType.EDIT,
          bucketProcessId: processId,
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DH,
          remarks: 'initiate edit additional information',
        });

        submitBucket({
          submitRequestDto: {
            action: 'EDIT',
            bucketProcessId: processId,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DH,
          },
        });
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      title: 'Data sebelumnya akan dirubah dengan Penerbitan Digital Memo yang baru,apakah anda yakin?',
    });
  };

  const autoSavePayload = useMemo(() => async () => {
    if (!containerAdditionalInformation || !processId) return null;

    const blob = await convertToDocx(containerAdditionalInformation);

    return {
      bucketProcessId: String(processId),
      description: blob,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
    };
  }, [containerAdditionalInformation, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: canUpdateAdditionalInfo && !viewOnly && !!additionalInformationDetail && !!processId,
    payload: autoSavePayload,
    url: 'mip.apuppt.saveAdditional',
  });

  return {
    additionalInformationDetail,
    canCreateAdditionalInfo,
    canUpdateAdditionalInfo,
    containerAdditionalInformation,
    formattedActionButton,
    handleBackToTable,
    handleButton,
    handleClose,
    handleEdit,
    handleSaveAdditionalInfo,
    isAutoSaveFetching,
    isEdit,
    isFetchLoading,
    isSaveLoading,
    isStaff,
    setContainer,
  };
};
