import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { SyncfusionFormatGenerate } from '@/enums/global';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';
import useGenerateDraftMemo from '@/components/shared/SmiTable/DraftMemo/hooks/useGenerateDraftMemo';


const useDraftMemo = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();

  const { mutate: generateDraftMemo } = useGenerateDraftMemo(
    {
      onError: (data) => {
        const title = `${data.response.data.errorDetail ?? 'Terjadi Kesalahan, Coba lagi nanti.'}`;
        showNiceModalV2({ title, type: 'error' });
      },
      onSuccess: () => {
        recordActivity({
          activity: ActivityType.DOWNLOAD,
          bucketProcessId: processId,
          module: TypeModule.APU_PPT,
          process: process,
          remarks: 'generate draft memo',
        });
        showNiceModalV2({ cancelText: 'Tutup', submitText: 'OK', title: 'Mohon Tunggu, Dokumen Sedang di Proses Maksimal 5 Menit', type: 'warning' });
      },
    }
  );
  const { process } = useApuPpt();


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
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.PDF,
            module: TypeModule.APU_PPT,
            process: process,
          });
        } else {
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.DOCX,
            module: TypeModule.APU_PPT,
            process: process,
          });
        }
      },
      submitText: 'Generate',
      title: 'Generate draft memo',
    });
  };

  return {
    handleOpenGenerateDraftModal,
    process,
    viewOnly,
  };

};

export default useDraftMemo;
