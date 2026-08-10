import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { SyncfusionFormatGenerate } from '@/enums/global';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGenerateDraftMemo from '@/components/shared/SmiTable/DraftMemo/hooks/useGenerateDraftMemo';


const useDraftMemo = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [state] = useApp();
  const [lastGeneratePayload, setLastGeneratePayload] = useState<any>(null);

  const { mutate: generateDraftMemo } = useGenerateDraftMemo(
    {
      onError: (data) => {
        const title = `${data.response.data.errorDetail ?? 'Terjadi Kesalahan, Coba lagi nanti.'}`;
        showNiceModalV2({ title, type: 'error' });
      },
      onSuccess: () => {
        // Record activity for generating draft memo
        recordActivity({
          activity: ActivityType.SAVE,
          bucketProcessId: processId || '',
          changeAfter: JSON.stringify({
            formatGenerate: lastGeneratePayload?.formatGenerate,
          }),
          changeBefore: '',
          menuCode: 'technical-study-review',
          module: state.pages.module,
          process: state.pages.process,
          remarks: `successfully generated draft memo (format: ${lastGeneratePayload?.formatGenerate})`,
        });

        showNiceModalV2({ cancelText: 'Tutup', submitText: 'OK', title: 'Mohon Tunggu, Dokumen Sedang di Proses Maksimal 5 Menit', type: 'warning' });

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
        if (file === 'pdf') {
          const payload = {
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.PDF,
            module: state.pages.module,
            process: state.pages.process,
          };
          setLastGeneratePayload(payload);
          generateDraftMemo(payload);
        } else {
          const payload = {
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.DOCX,
            module: state.pages.module,
            process: state.pages.process,
          };
          setLastGeneratePayload(payload);
          generateDraftMemo(payload);
        }
      },
      submitText: 'Generate',
      title: 'Generate draft memo',
    });
  };

  return {
    handleOpenGenerateDraftModal,
  };

};

export default useDraftMemo;
