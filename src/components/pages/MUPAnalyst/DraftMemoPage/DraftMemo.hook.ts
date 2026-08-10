import { useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { SyncfusionFormatGenerate } from '@/enums/global';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateDraftMemo from '@/hooks/services/bucket-document/draft-memo/useGenerateDraftMemo';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMUPAnalystAccess } from '../hooks/useMUPAnalystAccess';


const useDraftMemo = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { baseMUPAnalystAccess } = useMUPAnalystAccess();
  const { canView, canUpdate } = baseMUPAnalystAccess;

  useEffect(() => {
    if (!canView) return;

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId,
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.MUP,
      process: TypeProcess.MUP_ANALYST,
      remarks: 'view Draft Memo page',
    });
  }, [canView, processId, recordActivity]);

  const { mutate: generateDraftMemo } = useGenerateDraftMemo({
    onError: (error) => {
      const title = `${error?.data?.errorDetail ?? 'Terjadi Kesalahan, Coba lagi nanti.'}`;
      showNiceModalV2({ title, type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ cancelText: 'Tutup', submitText: 'OK', title: 'Mohon Tunggu, Dokumen Sedang di Proses Maksimal 5 Menit', type: 'warning' });
      closeNiceModal(MODAL.GLOBAL.SELECTOR);
    },
  });

  const handleOpenGenerateDraftMemoModal = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.MUP,
      process: TypeProcess.MUP_ANALYST,
      remarks: 'open generate draft memo modal',
    });

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
      onSubmit: (file: string) => {
        recordActivity({
          activity: ActivityType.SAVE,
          bucketProcessId: processId,
          changeAfter: '',
          changeBefore: '',
          module: TypeModule.MUP,
          process: TypeProcess.MUP_ANALYST,
          remarks: `generate draft memo in ${file} format`,
        });
        if (file === SyncfusionFormatGenerate.PDF) {
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.PDF,
            module: TypeModule.MUP,
            process: TypeProcess.MUP_ANALYST,
          });
        } else {
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.DOCX,
            module: TypeModule.MUP,
            process: TypeProcess.MUP_ANALYST,
          });
        }
      },
      submitText: 'Generate',
      title: 'Generate Draft Memo',
    });
  };

  return {
    canUpdate,
    canView,
    handleOpenGenerateDraftMemoModal,
  };
};

export default useDraftMemo;
