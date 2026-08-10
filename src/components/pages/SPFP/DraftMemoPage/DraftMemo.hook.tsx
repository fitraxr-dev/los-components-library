import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { SyncfusionFormatGenerate } from '@/enums/global';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import useGenerateDraftMemo from '@/components/shared/SmiTable/DraftMemo/hooks/useGenerateDraftMemo';


const useDraftMemo = () => {
  const bucket = useSpfpBucketContext();
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();

  const { mutate: generateDraftMemo } = useGenerateDraftMemo(
    {
      onError: (data) => {
        recordActivity({
          activity: ActivityType.CREATE,
          bucketProcessId: bucket?.bucketProcessId || '',
          changeAfter: '',
          changeBefore: '',
          module: bucket?.module || '',
          process: bucket?.process || '',
          remarks: `failed to generate draft memo for bucket: ${bucket?.bucketProcessId}`,
        });
        const title = `${data.response.data.errorDetail ?? 'Terjadi Kesalahan, Coba lagi nanti.'}`;
        showNiceModalV2({ title, type: 'error' });
      },
      onSuccess: () => {
        recordActivity({
          activity: ActivityType.CREATE,
          bucketProcessId: bucket?.bucketProcessId || '',
          changeAfter: '',
          changeBefore: '',
          module: bucket?.module || '',
          process: bucket?.process || '',
          remarks: `successfully initiated draft memo generation for bucket: ${bucket?.bucketProcessId}`,
        });
        showNiceModalV2({ cancelText: 'Tutup', submitText: 'OK', title: 'Mohon Tunggu, Dokumen Sedang di Proses Maksimal 5 Menit', type: 'warning' });
      },
    }
  );


  const handleOpenGenerateDraftModal = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `open generate draft memo modal for bucket: ${bucket?.bucketProcessId}`,
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
      onSubmit: (file) => {
        const formatGenerate = file === 'pdf' ? SyncfusionFormatGenerate.PDF : SyncfusionFormatGenerate.DOCX;
        const payload = {
          formatGenerate,
          ...bucket,
        };
        recordActivity({
          activity: ActivityType.CREATE,
          bucketProcessId: bucket?.bucketProcessId || '',
          changeAfter: JSON.stringify(payload),
          changeBefore: '',
          module: bucket?.module || '',
          process: bucket?.process || '',
          remarks: `initiate generate draft memo as ${file.toUpperCase()} for bucket: ${bucket?.bucketProcessId}`,
        });
        generateDraftMemo(payload);
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
