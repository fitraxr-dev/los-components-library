'use client';
import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { KEPATUHAN_SYARIAH } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
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

import Button from '@/components/shared/Button';

import { useShariahComplianceAccess } from '../../../hooks/useShariahComplianceAccess';
import useGetAdditionalInformation from '../../hooks/useGetAdditionalInformation';
import useSaveAdditionalSummary from '../../hooks/useSaveAdditionalSummary';


const useAdditionalInformation = (props: any) => {
  const {
    isLoading,
    setIsLoading,
    setIsEdit,
    isEdit,
    disclaimerValue,
    canUpdateShariahCompliance: canUpdateFromProps,
  } = props;
  const path = usePathname();
  const { processId }: { processId: string } = useParams();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const [state] = useApp();
  const [container, setContainer] = useState(null);
  const { setDirtyMsg } = useContext(DirtyContext);
  const { recordActivity } = useRecordLog();
  const { redirectToFromPage } = useNavigationFromPage();
  const [{ currentRole }] = useApp();
  const isTL = currentRole?.includes(roles.TL);
  const isMaker = currentRole?.includes(roles.MAKER);
  const {
    hasAnyViewAccess: canViewShariahCompliance,
    hasAnyCreateAccess: canCreateShariahCompliance,
    hasAnyUpdateAccess: canUpdateShariahComplianceFromHook,
  } = useShariahComplianceAccess();

  const canUpdateShariahCompliance = canUpdateFromProps !== undefined
    ? canUpdateFromProps
    : canUpdateShariahComplianceFromHook;

  const { data } = useGetAdditionalInformation({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DK,
  });
  const { stepper } = state;
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const actionButtons: Object = stepper.steps.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action;

  const modifiedObject = {};

  useEffect(() => {
    if (data && !isLoading && canViewShariahCompliance) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DK,
        remarks: 'view additional information detail page',
      });
    }
  }, [data, isLoading, processId, recordActivity, canViewShariahCompliance]);

  useEffect(() => {
    const isDisclaimerDirty = checkDisclaimerDirty();

    if (isDisclaimerDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [disclaimerValue, data]);

  const checkDisclaimerDirty = () => {
    if (!data) return false;

    const currentDisclaimer = disclaimerValue?.value || '';
    const originalDisclaimer = data.disclaimer || '';

    return currentDisclaimer !== originalDisclaimer;
  };

  // Iterate through the keys of the original object
  for (const key in actionButtons) {
    if (key.includes('TABLE_UPLOAD_DOCUMENT_DELETE') || key.includes('TABLE_UPLOAD_DOCUMENT_EDIT') || key.includes('TABLE_UPLOAD_DOCUMENT_DOWNLOAD')) {
    } else if (key.includes('APPROVE_ASK_FOR_INFO')) {
      if (actionButtons['APPROVE_ASK_FOR_INFO_BUSINESS'] && canUpdateShariahCompliance) {
        modifiedObject['APPROVE_ASK_FOR_INFO_MODAL'] = 'APPROVE_ASK_FOR_INFO_MODAL';
      } else if (canUpdateShariahCompliance) {
        modifiedObject['APPROVE_ASK_FOR_INFO'] = actionButtons[key];
      }
    } else if ((key.includes('ASK_FOR_INFO_TL') || key.includes('ASK_FOR_INFO_BUSINESS')) && canUpdateShariahCompliance) {
      modifiedObject['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else if (key.includes('EDIT') && canUpdateShariahCompliance) {
      setIsEdit(true);
    } else if (key.includes('SUBMIT_ASK_FOR_INFO_MODAL') && canUpdateShariahCompliance) {
      modifiedObject['SUBMIT_ASK_FOR_INFO_MODAL'] = actionButtons[key];
    } else if (canUpdateShariahCompliance) {
      // Only add other buttons if user has UPDATE permission
      modifiedObject[key] = actionButtons[key];
    }
  }

  const formatRadioBtn = () => {
    let radioButtons = [
      { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
      { label: isMaker ? 'Checker' : 'TL', value: isMaker ? 'ASK_FOR_INFO_CHECKER' : 'ASK_FOR_INFO_TL' }
    ];
    if (isTL) {
      radioButtons = [
        { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
        { label: 'Kadiv', value: 'SUBMIT' }
      ];
    }
    return radioButtons;
  };


  const { isSuccess: saveSummaryIsSuccess, mutate: saveSummary } = useSaveAdditionalSummary();

  const { isPending: submitBucketSuccessPending, mutate: submitBucket } = useSubmitBucket(
    {
      onError: (error) => {
        setIsLoading(false);
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
        } else if (action === 'EDIT') {
          activityType = ActivityType.EDIT;
          remarks = 'initiate edit additional information';
        }

        recordActivity({
          activity: activityType,
          bucketProcessId: processId,
          changeAfter: JSON.stringify(variables),
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DK,
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
          setIsLoading(false);
        } else {
          showNiceModalV2({
            onClose: () => {
              setTimeout(() => {
                setIsLoading(false);
                router.push(replacePath(KEPATUHAN_SYARIAH.BASE_PATH, {
                  module: moduleIndex,
                }));
              }, 3000);
            },
            title: 'Data berhasil di simpan',
            type: 'success',
          });
        }
      },
    }
  );

  const saveThenOpenComment = async (action: string) => {
    if (!canUpdateShariahCompliance) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      remarks: `initiate save before action: ${action}`,
    });

    try {
      const blob = await convertToDocx(container);

      saveSummary({
        bucketProcessId: processId,
        description: blob,
        disclaimer: disclaimerValue?.value,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DK,
      }, {
        onError: (error) => {

          const errorMessage = error?.message;
          showNiceModalV2({
            title: errorMessage,
            type: 'error',
          });
          setIsLoading(false);
        },
        onSuccess: (data) => {
          recordActivity({
            activity: ActivityType.ADD,
            bucketProcessId: processId,
            changeAfter: JSON.stringify(data),
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DK,
            remarks: 'save additional summary (save before submit)',
          });

          setDirtyMsg(undefined);
          queryClient.invalidateQueries({
            queryKey: ['additional-summary', { bucketProcessId: processId }],
          });
          queryClient.invalidateQueries({
            queryKey: ['bucket-stepper', { bucketProcessId: processId }],
          });
          NiceModal.show(MODAL.GLOBAL.COMMENT, {
            onSave: ({ comment }) => {
              setIsLoading(true);
              submitBucket({
                submitRequestDto: {
                  action: action,
                  bucketProcessId: processId,
                  comment,
                  module: TypeModule.MIP_REVIEW,
                  process: TypeProcess.REVIEWER_DK,
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
      setIsLoading(false);
    }
  };

  const autoSavePayload = useMemo(() => async () => {

    const blob = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description: blob,
      disclaimer: disclaimerValue?.value,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
    };
  }, [container, processId, disclaimerValue]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: canUpdateShariahCompliance && !viewOnly,
    payload: autoSavePayload,
    url: 'mip.additionalInformation.save',
  });


  const handleButton = (key: string, value: string) => {
    if (!canUpdateShariahCompliance) return null;
    const isProgressComplete = stepper?.progress === 100;


    switch (key) {
      case 'SUBMIT':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="success"
            isLoading={isLoading}
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
            isLoading={isLoading}
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
            isLoading={isLoading}
          >
            Approve
          </Button>
        );
      case 'RETURN_TO_TL':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="info"
            isLoading={isLoading}
          >
            Return to TL
          </Button>
        );
      case 'RETURN_TO_MAKER':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="info"
            isLoading={isLoading}
          >
            Return to Maker
          </Button>
        );
      case 'APPROVE_ASK_FOR_INFO_MODAL':
        return (
          <Button
            onClick={() => handleApproveAskForInfo()}
            variant="contained"
            color="warning"
            isLoading={isLoading}
          >
            Approve ask for info
          </Button>
        );
      case 'SUBMIT_ASK_FOR_INFO_MODAL':
        return (
          <Button
            onClick={() => handleApproveAskForInfo()}
            variant="contained"
            color="warning"
            isLoading={isLoading}
          >
            Submit ask for info
          </Button>
        );
      case 'APPROVE_ASK_FOR_INFO':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="warning"
            isLoading={isLoading}
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
            isLoading={isLoading}
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
            isLoading={isLoading}
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
            isLoading={isLoading}
          >
            Ask for info
          </Button>
        );
    }
  };

  const handleSaveKesimpulan = (blob: Blob) => {
    if (!canUpdateShariahCompliance) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      remarks: 'initiate save additional summary',
    });

    saveSummary({
      bucketProcessId: processId,
      description: blob,
      disclaimer: disclaimerValue?.value,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
    }, {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: (data) => {
        recordActivity({
          activity: ActivityType.ADD,
          bucketProcessId: processId,
          changeAfter: JSON.stringify(data),
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DK,
          remarks: 'save additional summary',
        });

        setDirtyMsg(undefined);
        showNiceModalV2({ title: 'Data berhasil di simpan', type: 'success' });
      },
    });

    setDirtyMsg(undefined);
  };

  const handleAskForInfo = () => {
    if (!canUpdateShariahCompliance) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      remarks: 'open ask for info modal',
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        setIsLoading(true);
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DK,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: formatRadioBtn(),
    });
  };

  const handleNoChange = () => {
    if (!canUpdateShariahCompliance) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
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
            process: TypeProcess.REVIEWER_DK,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleApproveAskForInfo = () => {
    if (!canUpdateShariahCompliance) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      remarks: 'open approve ask for info modal',
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DK,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: [
        { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
        { label: 'Kadiv', value: 'SUBMIT' }
      ],
    });
  };

  const handleSubmit = (action: string) => {
    if (!canUpdateShariahCompliance) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      remarks: `open submit modal for action: ${action}`,
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        setIsLoading(true);
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DK,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleEdit = () => {
    if (!canUpdateShariahCompliance) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      remarks: 'open edit confirmation modal',
    });

    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => {
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      onSubmit: () => {
        setIsLoading(true);
        submitBucket({
          submitRequestDto: {
            action: 'EDIT',
            bucketProcessId: processId,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DK,
          },
        });
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      title: 'Data sebelumnya akan dirubah dengan Penerbitan Digital Memo yang baru,apakah anda yakin?',
    });
  };

  const handleClose = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      remarks: 'close additional information page',
    });
    if (redirectToFromPage()) return;
    router.push(replacePath(KEPATUHAN_SYARIAH.BASE_PATH, { module: moduleIndex }));
  };

  return {
    canCreateShariahCompliance,
    canUpdateShariahCompliance,
    canViewShariahCompliance,
    container,
    data,
    handleAskForInfo,
    handleButton,
    handleClose,
    handleEdit,
    handleSaveKesimpulan,
    handleSubmit,
    isAutoSaveFetching,
    isEdit,
    isLoading,
    modifiedObject,
    saveSummaryIsSuccess,
    setContainer,
    submitBucketSuccessPending,
    theme,
    viewOnly,
  };
};

export default useAdditionalInformation;
