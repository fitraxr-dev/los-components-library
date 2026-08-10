import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { SyncfusionFormatGenerate } from '@/enums/global';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGenerateDraftMemo from '@/components/shared/SmiTable/DraftMemo/hooks/useGenerateDraftMemo';


const useDraftMemo = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();


  const { mutate: generateDraftMemo } = useGenerateDraftMemo({
    onError: (error) => {
      const errorData = error?.response?.data || error;
      const errorDetail = errorData?.errorDetail || errorData?.errorDesc || error?.message || 'Terjadi Kesalahan, Coba lagi nanti.';
      showNiceModalV2({
        title: errorDetail,
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        cancelText: 'Tutup',
        submitText: 'OK',
        title: 'Mohon Tunggu, Dokumen Sedang di Proses Maksimal 5 Menit',
        type: 'warning',
      });
    },
  });


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
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DEPI,
          });
        } else {
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.DOCX,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DEPI,
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
