import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { SyncfusionFormatGenerate } from '@/enums/global';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetListProcessingType from '@/components/shared/SmiSection/PK/hooks/useGetListProcessingType';
import useGenerateDraftMemo from '@/components/shared/SmiTable/DraftMemo/hooks/useGenerateDraftMemo';


const useDraftMemo = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();

  const { mutate: generateDraftMemo } = useGenerateDraftMemo(
    {
      onError: (data) => {
        const title = `${data.response.data.errorDetail ?? 'Terjadi Kesalahan, Coba lagi nanti.'}`;
        showNiceModalV2({ title, type: 'error' });
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
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.PDF,
            module: TypeModule.ENGAGEMENT_AGREEMENT,
            process: TypeProcess.ENGAGEMENT_AGREEMENT,
          });
        } else {
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.DOCX,
            module: TypeModule.ENGAGEMENT_AGREEMENT,
            process: TypeProcess.ENGAGEMENT_AGREEMENT,
          });
        }
      },
      submitText: 'Generate',
      title: 'Generate draft memo',
    });
  };

  const { data: pkList, isSuccess } = useGetListProcessingType(
    {
      bucketProcessId: processId,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.PROCESSING_TYPE_PK,
    }
  );

  const pkptBucketProcessIds = isSuccess
    ? pkList?.contents
      ?.filter(({ bucketProcessId, isDeleted }) =>
        bucketProcessId.startsWith('PKPT-') && isDeleted === false
      )
      ?.map(({ bucketProcessId }) => bucketProcessId)
    : [];

  // Create processId and childId on single string seprated with pipe (|)
  const formattedStringProcessId = [...(pkptBucketProcessIds || []), processId]
    .sort()
    .reverse()
    .join('|');

  return {
    formattedStringProcessId,
    handleOpenGenerateDraftModal,
    viewOnly,
  };

};

export default useDraftMemo;
