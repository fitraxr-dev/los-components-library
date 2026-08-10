import { useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { SyncfusionFormatGenerate } from '@/enums/global';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGenerateDraftMemo from '@/components/shared/SmiTable/DraftMemo/hooks/useGenerateDraftMemo';

import { useESDDAccess } from '../hooks/useESDDAccess';


const useDraftMemo = () => {
  const { viewOnly } = useViewOnly();
  const { processId, parentId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const {
    hasAnyUpdateAccess,
  } = useESDDAccess();

  const canUpdateDraftMemo = hasAnyUpdateAccess();

  // Record view activity when component mounts
  useEffect(() => {
    if (processId) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: processId,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'Viewing Draft Memo page',
      });
    }
  }, [processId, recordActivity]);

  const { mutate: generateDraftMemo } = useGenerateDraftMemo(
    {
      onError: (data) => {
        const title = `${data.response.data.errorDetail ?? 'Terjadi Kesalahan, Coba lagi nanti.'}`;
        showNiceModalV2({ title, type: 'error' });

        recordActivity({
          activity: 'GENERATE_ERROR',
          bucketProcessId: processId,
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DELST,
          remarks: `Error generating draft memo: ${title}`,
        });
      },
      onSuccess: () => {
        showNiceModalV2({ cancelText: 'Tutup', submitText: 'OK', title: 'Mohon Tunggu, Dokumen Sedang di Proses Maksimal 5 Menit', type: 'warning' });

        recordActivity({
          activity: 'GENERATE_DRAFT_MEMO',
          bucketProcessId: processId,
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DELST,
          remarks: 'Successfully generated draft memo',
        });
      },
    }
  );


  const handleOpenGenerateDraftModal = () => {
    NiceModal.show(MODAL.GLOBAL.SELECTOR, {
      data: [
        {
          key: 'pdf',
          label: 'PDF',
        },
        {
          key: 'word',
          label: 'WORD',
        }
      ],
      onSubmit: (file) => {
        recordActivity({
          activity: 'SELECT_FORMAT',
          bucketProcessId: processId,
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DELST,
          remarks: `Selected format: ${file === 'pdf' ? 'PDF' : 'Word'} for draft memo generation`,
        });

        if (file === 'pdf') {
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.PDF,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DELST,
          });
        } else {
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.DOCX,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DELST,
          });
        }
      },
      submitText: 'Generate',
      title: 'Generate draft memo',
    });
  };

  return {
    canUpdateDraftMemo,
    handleOpenGenerateDraftModal,
    parentId,
    processId,
    viewOnly,
  };

};

export default useDraftMemo;
