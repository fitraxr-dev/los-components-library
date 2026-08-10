import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { SyncfusionFormatGenerate } from '@/enums/global';
import { TypeModule } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateDraftMemo from '@/hooks/services/bucket-document/draft-memo/useGenerateDraftMemo';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';


const useDraftMemo = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { typeProcess } = useAnnualReviewContext();
  const { recordActivity } = useRecordLog();
  const { mutate: generateDraftMemo } = useGenerateDraftMemo(
    {
      onError: (data) => {
        const title = `${data.response.data.errorDetail ?? 'Terjadi Kesalahan, Coba lagi nanti.'}`;
        showNiceModalV2({ title, type: 'error' });
      },
      onSuccess: (data) => {
        recordActivity({
          activity: ActivityType.CREATE,
          changeAfter: JSON.stringify({
            payload: data.response.data,
            type: 'new',
          }),
          menuCode: 'annual-review',
          module: TypeModule.ANNUAL_REVIEW,
          process: typeProcess,
          remarks: 'generate new draft memo',
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
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.PDF,
            module: TypeModule.ANNUAL_REVIEW,
            process: typeProcess,
          });
        } else {
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.DOCX,
            module: TypeModule.ANNUAL_REVIEW,
            process: typeProcess,
          });
        }
      },
      submitText: 'Generate',
      title: 'Generate draft memo',
    });
  };

  return {
    handleOpenGenerateDraftModal,
    typeProcess,
    viewOnly,
  };

};

export default useDraftMemo;
