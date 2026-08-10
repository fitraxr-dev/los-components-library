import { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import {
  APPROVE_ASK_FOR_INFO,
  ASK_FOR_INFO,
  ASK_FOR_INFO_SUMMARY,
  ASK_FOR_INFO_SUMMARY_KADIV_DPOP,
  ASK_FOR_INFO_SUMMARY_TL_DPOP,
  roles,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { creditChecking } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import Button from '@/components/shared/Button';

import useGetSummary from './hooks/useGetSummary';
import useSaveSummary from './hooks/useSaveSummary';
import { RETURN_TO_STAFF, RETURN_TO_TL } from './Summary.constants';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';
import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


export const useSummary = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [{ currentRole }] = useApp();
  const { processId } = useIdentity();
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { viewOnly } = useViewOnly();
  const { actions, isDpop, isRequestModule, stepper, isStaff } = useCreditCheckingContext();

  const [disclaimerContainer, setDisclaimerContainer] = useState<DocumentEditorContainerComponent>(null);
  const [notesContainer, setNotesContainer] = useState<DocumentEditorContainerComponent>(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    // disclaimer: false,
    notes: false,
  });
  const currentListPage = `/${pathname.split('/').splice(1, 3).join('/')}`;
  const isRm = currentRole.includes(roles.RM);
  const isKadiv = currentRole.includes(roles.KADIV);
  const { recordActivity } = useRecordLog();

  const { data } = useGetSummary({ bucketProcessId: processId });

  const isEnabled = data?.content?.isResultCompleted;

  useEffect(() => {
    if (data?.content?.notes !== null) {
      if (notesContainer !== null) {
        setIsWordEditorEmpty({
          // disclaimer: disclaimerContainer?.documentEditor.isDocumentEmpty,
          notes: notesContainer?.documentEditor.isDocumentEmpty,
        });
      } else {
        setIsWordEditorEmpty({
          // disclaimer: true,
          notes: true,
        });
      }
    } else {
      setIsWordEditorEmpty({
        // disclaimer: true,
        notes: true,
      });
    }
  }, [notesContainer, data]);

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.CREDIT_CHECKING,
    process: TypeProcess.CREDIT_CHECKING_DPOP,
  });

  useEffect(() => {
    if (bucketDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.CREDIT_CHECKING,
        process: TypeProcess.CREDIT_CHECKING_DPOP,
        remarks: 'view credit checking summary page',
      });
    }
  });

  const { isPending: saveSummaryLoading, mutate: saveSummary } = useSaveSummary({
    onSuccess: (data, variables) => {
      setDirtyMsg(undefined);
      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(variables),
        module: TypeModule.CREDIT_CHECKING,
        process: TypeProcess.CREDIT_CHECKING_DPOP,
        remarks: 'edit credit checking summary page',
      });

      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['get-summary', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket', { bucketProcessId: processId }]});
    },
  });

  const { mutate: submitCreditCheckingSummary, isPending: isSubmitSummaryLoading } = useSubmitBucket({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['get-summary', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket', { bucketProcessId: processId }]});
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS).then(() => {
            router.push(currentListPage);
          });
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOpenSubmitModal = ({ action, process }: { action: string; process: string }) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        let activityType = ActivityType.SUBMIT;
        let remarks;

        if (action === 'RETURN_TO_TL') {
          activityType = ActivityType.RETURN_TO_TL;
          remarks = `reject and return credit checking(${action})`;
        } else if (action.includes('RETURN_TO_STAFF')) {
          activityType = ActivityType.RETURN_TO_STAFF;
          remarks = `reject and return credit checking(${action})`;
        } else if (action === 'SUBMIT') {
          activityType = ActivityType.CANCEL;
          remarks = 'submit credit checking';
        }

        recordActivity({
          activity: activityType,
          bucketProcessId: processId,
          changeAfter: JSON.stringify({
            action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.CREDIT_CHECKING,
            process,
          }),
          module: TypeModule.CREDIT_CHECKING,
          process: TypeProcess.CREDIT_CHECKING_DPOP,
          remarks: remarks,
        });
        submitCreditCheckingSummary({
          submitRequestDto: {
            action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.CREDIT_CHECKING,
            process,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleSave = async () => {
    // const disclaimer = await convertToDocx(disclaimerContainer);
    const notes = await convertToDocx(notesContainer);
    saveSummary({
      bucketProcessId: processId,
      // disclaimer: disclaimer,
      notes: notes,
    });
  };

  const { mutate: submitCreditCheckingRequest, isPending: isSubmitLoading } = useSubmitBucket({
    onSuccess: (_, variables: { submitRequestDto: SubmitRequestDto }) => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS);
          router.push(creditChecking.BUCKET_LIST_PAGE);
        },
        title: 'Data berhasil dikirim',
        type: 'success',
      });
    },
  });

  const buttonListTemplateByKey = [RETURN_TO_STAFF, RETURN_TO_TL, ASK_FOR_INFO, APPROVE_ASK_FOR_INFO, SUBMIT];

  const handleAskForInfo = ({ action, process }: { action: string; process: string }) => {
    const tempRadtioOption = [
      { label: 'Bisnis', value: 'BUSINESS' },
      { label: isRm ? 'TL' : 'KADIV', value: isRm ? 'TL' : 'KADIV' }
    ];
    const radioOptionByRole = isKadiv ? null : tempRadtioOption;
    if (isDpop) {
      NiceModal.show(
        MODAL.GLOBAL.COMMENT,
        {
          onSave: ({ comment, radioValue }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);

            const actionByRadioValue = {
              'BUSINESS': ASK_FOR_INFO_SUMMARY,
              'KADIV': ASK_FOR_INFO_SUMMARY_KADIV_DPOP,
              'TL': ASK_FOR_INFO_SUMMARY_TL_DPOP,
            };

            submitCreditCheckingRequest({
              submitRequestDto: {
                action: isKadiv ? ASK_FOR_INFO_SUMMARY : actionByRadioValue[radioValue],
                bucketProcessId: processId,
                comment,
                module: TypeModule.CREDIT_CHECKING,
                process: isDpop ? TypeProcess.CREDIT_CHECKING_DPOP : TypeProcess.CREDIT_CHECKING,
              },
            });
          },
          radioLabel: 'Forward To',
          radioOptions: radioOptionByRole,
        },
      );

    }

  };

  const renderActionButtons = () => {
    if (JSON.stringify(actions) === '{}') {
      return [];
    }

    let buttonContents = [];

    for (const key in actions) {
      if (buttonListTemplateByKey.includes(key)) {
        const indexByKeyInTemplate = buttonListTemplateByKey.indexOf(key);
        buttonContents[indexByKeyInTemplate] = [key, actions[key]];
      }
    }

    const buttonlist = buttonContents.map((button) => {
      const [key, value]: string[] = button;
      const [action, process] = value.split('|');

      switch (key) {
        case RETURN_TO_STAFF:
          return (
            <Button
              disabled={viewOnly}
              color="primary"
              onClick={() => !saveSummaryLoading ? handleOpenSubmitModal({ action, process }) : null}
              isLoading={saveSummaryLoading}
            >
              Return to Staff
            </Button>
          );
        case ASK_FOR_INFO:
          return (
            <Button
              disabled={viewOnly}
              color="lightYellow"
              onClick={() => handleAskForInfo({ action, process })}
            >
              Ask For Info
            </Button>
          );
        case APPROVE_ASK_FOR_INFO:
          return (
            <Button
              disabled={viewOnly}
              color="lightYellow"
              onClick={() => handleAskForInfo({ action, process })}
            >
              Approve Ask For Info
            </Button>
          );
        case RETURN_TO_TL:
          return (
            <Button
              disabled={viewOnly}
              color="info"
              onClick={() => !saveSummaryLoading ? handleOpenSubmitModal({ action, process }) : null}
              isLoading={saveSummaryLoading}
            >
              Return to TL
            </Button>
          );
        case SUBMIT:
          return (
            <Button
              disabled={viewOnly || isWordEditorEmpty.notes || !isEnabled}
              color="success"
              onClick={() => !saveSummaryLoading ? handleOpenSubmitModal({ action, process }) : null}
              isLoading={saveSummaryLoading}
            >
              {isKadiv ? 'Approve' : 'Submit'}
            </Button>
          );
        default:
          return null;
      }
    });

    return buttonlist;
  };

  return {
    bucketDetail,
    currentListPage,
    data,
    disclaimerContainer,
    handleOpenSubmitModal,
    handleSave,
    isRequestModule,
    isSubmitSummaryLoading,
    isWordEditorEmpty,
    notesContainer,
    renderActionButtons,
    saveSummaryLoading,
    setDisclaimerContainer,
    setIsWordEditorEmpty,
    setNotesContainer,
  };
};
