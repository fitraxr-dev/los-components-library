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
import useGetParameterCOTEODDetail from '../../hooks/useGetParameterCOTEODDetail';
import useGetParameterCOTEODSubmissionDetail from '../../hooks/useGetParameterCOTEODSubmissionDetail';
import useSaveParameterCOTEODDetail from '../../hooks/useSaveParameterCOTEOD';


const useTabProcess = (kind: 'COT' | 'EOD', form: any) => {
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const { processId, isBucketProcessId, isViewOnly } = useMasterParameter();

  const parameterCOTEODDetail = useGetParameterCOTEODDetail(kind, {
    id: Number(processId),
  });
  const parameterCOTEODSubmissionDetail = useGetParameterCOTEODSubmissionDetail({
    bucketProcessId: processId,
  }, { enabled: isBucketProcessId });
  const { data: parameterCOTEODDetailData, isFetching: isLoading } =
    isBucketProcessId
      ? parameterCOTEODSubmissionDetail
      : parameterCOTEODDetail;

  const { mutate: saveParameterCOTEOD } = useSaveParameterCOTEODDetail(kind, {
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
        changeBefore: JSON.stringify(parameterCOTEODDetailData?.content),
        menuCode: 'parameter-cot-eod',
        module: TypeModule.PARAMETER_COT_EOD,
        process: TypeProcess.PARAMETER_COT_EOD,
        remarks: 'Successfully Saved Parameter COT & EOD Process',
      });

      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS).then(() => {
            const nextPath = replacePath(`${MASTER_PARAMETER.PARAMETER_COT_EOD_DETAIL_PAGE}?tab=${TAB.SUMMARY}`, {
              mode: kind === 'COT' ? 'submission-cot' : 'submission-eod',
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
        saveParameterCOTEOD({
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

  const watchedValues = form.watch();

  const autoSavePayload = useMemo(() => () => {
    const rootData = parameterCOTEODDetailData || {};

    const hasBucketId = isBucketProcessId || !rootData.bucketProcessId;

    const basePayload = {
      ...(hasBucketId ? {
        bucketProcessId: rootData.bucketProcessId || processId,
        id: null,
      } : {
        bucketProcessId: null,
        id: Number(processId),
      }),
      isActive: watchedValues.isActive,
      process: watchedValues.process,
      ...(kind === 'COT'
        ? { cutOfTime: watchedValues.cutOfTime }
        : { endOfDay: watchedValues.endOfDay, eodDate: watchedValues.eodDate }
      ),
    };

    return Promise.resolve(basePayload);
  }, [watchedValues, parameterCOTEODDetailData, processId, isBucketProcessId, kind]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isViewOnly && !!parameterCOTEODDetailData,
    payload: autoSavePayload,
    url: kind === 'COT' ? 'parameter.parameterCotEod.cotStore' : 'parameter.parameterCotEod.eodStore',
  });

  return {
    data: parameterCOTEODDetailData?.content,
    handleSave,
    isAutoSaveFetching,
    isLoading,
  };
};

export default useTabProcess;
