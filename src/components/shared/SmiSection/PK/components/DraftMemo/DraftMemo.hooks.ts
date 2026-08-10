import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { SyncfusionFormatGenerate } from '@/enums/global';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGenerateDraftMemo from '@/components/shared/SmiTable/DraftMemo/hooks/useGenerateDraftMemo';


const useDraftMemo = () => {
  const { childId } = useIdentity();
  const { viewOnly } = useViewOnly();

  const { mutate: generateDraftMemo } = useGenerateDraftMemo(
    {
      onError: (data) => {
        showNiceModalV2({
          cancelText: 'Tutup',
          submitText: 'OK',
          title: `${data.response.data.errorDetail}`,
          type: 'warning' });
      },
      onSuccess: () => {
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
          generateDraftMemo({
            bucketProcessId: childId,
            formatGenerate: SyncfusionFormatGenerate.PDF,
            module: TypeModule.ENGAGEMENT_AGREEMENT,
            process: TypeProcess.PROCESSING_TYPE_PK,
          });
        } else {
          generateDraftMemo({
            bucketProcessId: childId,
            formatGenerate: SyncfusionFormatGenerate.DOCX,
            module: TypeModule.ENGAGEMENT_AGREEMENT,
            process: TypeProcess.PROCESSING_TYPE_PK,
          });
        }
      },
      submitText: 'Generate',
      title: 'Generate draft memo',
    });
  };

  return {
    handleOpenGenerateDraftModal,
    viewOnly,
  };

};

export default useDraftMemo;
