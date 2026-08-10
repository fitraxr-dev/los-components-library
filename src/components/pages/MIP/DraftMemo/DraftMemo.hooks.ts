import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { SyncfusionFormatGenerate } from '@/enums/global';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailBucketDebtor from '@/hooks/services/bucket/debtor/useGetDetailBucketDebtor';
import useGenerateDraftMemo from '@/hooks/services/bucket-document/draft-memo/useGenerateDraftMemo';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';


const useDraftMemo = () => {
  const { processId } = useIdentity();
  const [state] = useApp();
  const { viewOnly } = useViewOnly();

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
          menuCode: 'mip',
          module: state.pages.mipModule,
          process: state.pages.mipProcess,
          remarks: 'generate new draft memo',
        });
        showNiceModalV2({ cancelText: 'Tutup', submitText: 'OK', title: 'Mohon Tunggu, Dokumen Sedang di Proses Maksimal 5 Menit', type: 'warning' });
      },
    }
  );

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  }, { enabled: !!processId && !!state.pages.mipModule && !!state.pages.mipProcess });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
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
            module: state.pages.mipModule,
            process: state.pages.mipProcess,
          });
        } else {
          generateDraftMemo({
            bucketProcessId: processId,
            formatGenerate: SyncfusionFormatGenerate.DOCX,
            module: state.pages.mipModule,
            process: state.pages.mipProcess,
          });
        }
      },
      submitText: 'Generate',
      title: 'Generate draft memo',
    });
  };

  return {
    bucketMasterId: debtorInfoData?.bucketMasterId,
    handleOpenGenerateDraftModal,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    viewOnly,
  };

};

export default useDraftMemo;
