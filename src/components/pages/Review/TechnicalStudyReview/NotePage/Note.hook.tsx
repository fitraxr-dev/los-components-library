import { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { technicalStudyReview } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useTechnicalStudyReview from '@/components/layouts/TechnicalStudyReviewLayout/TechnicalStudyReview.hook';

import useDebtorInformation from '../DebtorInformationPage/DebtorInformation.hook';

import useGetNote from './hooks/useGetNote';
import useSaveNote from './hooks/useSaveNote';
import useUpdateAcknowledge from './hooks/useUpdateAcknowledge';

import type { SaveDto } from './hooks/useSaveNote';


export type ActionButtonType = 'ASK_FOR_INFO' | 'SUBMIT' | 'APPROVE_ASK_FOR_INFO' | 'ASK_FOR_INFO' | 'RETURN_TO_SPECIALIST' | 'DECLINE';


export const useNote = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const router = useCustomRouter();
  const pathname = usePathname();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [state] = useApp();
  const { validateResult } = useDebtorInformation();
  const [lastSubmitPayload, setLastSubmitPayload] = useState<any>(null);

  const isDebtorInvalid = validateResult?.content?.invalid === true && validateResult?.content?.result?.includes('Sedang dilakukan perubahan Data Customer');

  // Fetch Request Detail
  const {
    data: noteDetail,
  } = useGetNote({
    bucketProcess: processId,
  });

  // Record activity when note detail is loaded
  useEffect(() => {
    if (noteDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: state.pages.module,
        process: state.pages.process,
        remarks: 'view technical study review note page',
      });
    }
  }, [noteDetail, processId, state.pages.module, state.pages.process, recordActivity]);

  const queryClient = useQueryClient();

  useEffect(() => {
    setDirtyMsg(undefined);
  });

  // Save Request / Result
  const { mutate: saveNote } = useSaveNote({
    onSuccess: () => {
      // Record activity for saving note
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          notes: 'saved',
        }),
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: state.pages.module,
        process: state.pages.process,
        remarks: 'successfully saved technical study review note',
      });

      showNiceModalV2({
        onClose() {
          queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
          queryClient.invalidateQueries({
            queryKey: [
              'technical-review',
              {
                'bucketProcessId': processId,
                'module': TypeModule.TECHNICAL_REVIEW,
                process,
              }
            ],
          });
        }, type: 'success',
      });
    },
  });

  // Update Acknowledge API
  const { mutate: updateAcknowledge } = useUpdateAcknowledge({
    onError: () => {
      console.error('Update acknowledge failed');
    },
    onSuccess: () => {
      console.log('Update acknowledge successful');
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
        setLastSubmitPayload({ action: radioValue, comment });
        submitNote(payload);
      },
      radioLabel: 'Declined',
      radioOptions: [
        { label: 'Canceled', value: 'CANCELED' },
        { label: 'Rejected', value: 'REJECTED' },
      ],
    });
  };

  const handleActionButton = (type: ActionButtonType) => {
    let action: string;

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        closeNiceModal(MODAL.GLOBAL.COMMENT);

        if (type === 'ASK_FOR_INFO') {
          action = radioValue;
          // Only call updateAcknowledge API when forwarded to Bisnis (ASK_FOR_INFO_RM)
          if (radioValue === 'ASK_FOR_INFO_RM') {
            updateAcknowledge({
              bucketProcessId: processId,
            });
          }
        } else {
          action = type;
        }

        const payload = {
          submitRequestDto: {
            action,
            bucketProcessId: processId,
            comment,
            module: state.pages.module,
            process: state.pages.process,
          },
        };
        setLastSubmitPayload({ action, comment });
        submitNote(payload);
      },
      ...(type === 'ASK_FOR_INFO' && {
        radioLabel: 'Forward to',

        radioOptions: [
          { label: 'Bisnis', value: 'ASK_FOR_INFO_RM' },
          { label: 'KADIV', value: 'ASK_FOR_INFO_KADIV' }
        ],
      }),
    });
  };

  const handleSave = (blob) => {
    const payload: SaveDto = {
      bucketProcess: processId,
      module: state.pages.module,
      notes: blob,
      process: state.pages.process,
    };

    saveNote(payload);
  };

  const { mutate: submitNote, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      // Record activity for submitting note
      const activityType = lastSubmitPayload?.action === 'CANCELED' || lastSubmitPayload?.action === 'REJECTED'
        ? ActivityType.REJECT
        : lastSubmitPayload?.action === 'RETURN_TO_SPECIALIST'
          ? ActivityType.RETURN_TO_MAKER
          : lastSubmitPayload?.action?.includes('ASK_FOR_INFO')
            ? ActivityType.SUBMIT
            : ActivityType.SUBMIT;

      recordActivity({
        activity: activityType,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          action: lastSubmitPayload?.action,
          comment: lastSubmitPayload?.comment,
        }),
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: state.pages.module,
        process: state.pages.process,
        remarks: `successfully ${lastSubmitPayload?.action?.toLowerCase() || 'submitted'} technical study review note`,
      });

      showNiceModalV2({
        onClose: () => {
          const isFromMonitoring = pathname?.includes('monitoring');
          const destination = isFromMonitoring
            ? technicalStudyReview.MONITORING_PAGE
            : replacePath(technicalStudyReview.REVIEW_PAGE, {});
          router.push(destination);
        }, title: 'Data berhasil dikirim', type: 'success',
      });
    },
  });

  return {
    handleActionButton,
    handleSave,
    isDebtorInvalid,
    isSubmitLoading,
    noteDetail,
  };
};
