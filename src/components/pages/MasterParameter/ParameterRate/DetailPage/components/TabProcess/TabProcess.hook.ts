import { useMemo } from 'react';

import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import { TAB } from '../../Detail.constant';
import useGetParameterRateDetail from '../../hooks/useGetParameterRateDetail';
import useGetParameterRateSubmissionDetail from '../../hooks/useGetParameterRateSubmissionDetail';
import useSaveParameterRateDetail from '../../hooks/useSaveParameterRate';


const useTabProcess = (form: any) => {
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const { processId, isBucketProcessId, isViewOnly } = useMasterParameter();

  const parameterRateDetail = useGetParameterRateDetail({
    id: Number(processId),
  });
  const parameterRateSubmissionDetail = useGetParameterRateSubmissionDetail({
    bucketProcessId: processId,
  }, { enabled: isBucketProcessId });
  const { data: parameterRateDetailData, isFetching: isLoading } =
    isBucketProcessId
      ? parameterRateSubmissionDetail
      : parameterRateDetail;

  const { mutate: saveParameterRate } = useSaveParameterRateDetail({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: data?.content.bucketProcessId || '',
        changeAfter: JSON.stringify(data?.content),
        changeBefore: JSON.stringify(parameterRateDetailData?.content),
        menuCode: 'parameter-rate',
        module: TypeModule.PARAMETER_RATE,
        process: TypeProcess.PARAMETER_RATE,
        remarks: 'Successfully Saved Parameter Rate Process',
      });

      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS).then(() => {
            const nextPath = replacePath(`${MASTER_PARAMETER.PARAMETER_RATE_DETAIL_PAGE}?tab=${TAB.SUMMARY}`, {
              mode: 'submission',
              processId: data?.content.bucketProcessId,
            });
            router.push(nextPath);
          });
        },
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });

  const handleSave = (payload) => {
    showNiceModalV2({
      onClose: () => {
        closeNiceModal(MODAL.GLOBAL.WARNING);
      },
      onSubmit: () => {
        saveParameterRate({
          ...(isBucketProcessId ? {
            bucketProcessId: processId,
            id: null,
          } : {
            bucketProcessId: null,
            id: processId,
          }),
          ...payload,
        });
      },
      title: 'Apakah Anda yakin ingin mengedit data ini?',
      type: 'warning',
    });
  };

  const watchedValues = form;
  const sanitizeCurrency = (value: any) => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const cleaned = String(value).replace(/[^0-9.]/g, '');
    return Number(cleaned) || 0;
  };

  const autoSavePayload = useMemo(() => () => {
    const base = parameterRateDetailData?.content || {};

    return Promise.resolve({
      ...base,

      ...(isBucketProcessId ? {
        bucketProcessId: processId,
        id: null,
      } : {
        bucketProcessId: null,
        id: Number(processId),
      }),

      ...watchedValues,
      exchangeRate: sanitizeCurrency(watchedValues.exchangeRate),
    });
  }, [watchedValues, parameterRateDetailData, processId, isBucketProcessId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isViewOnly && !!parameterRateDetailData && parameterRateDetailData?.content?.isEditable === true,
    payload: autoSavePayload,
    url: 'parameter.parameterRate.store',
  });

  return {
    data: parameterRateDetailData?.content,
    handleSave,
    isAutoSaveFetching,
    isLoading,
  };
};

export default useTabProcess;
