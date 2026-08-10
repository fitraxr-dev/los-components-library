import { useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

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
import { TAB } from '@/components/pages/MasterParameter/ParameterSLA/DetailPage/Detail.constant';

import useGetParameterSLASubmissionDetail from '../../../../hooks/useGetParameterSLASubmissionDetail';
import useGetParameterSLADetail from '../../../../hooks/useGetParamterSLADetail';
import useSaveParameterSLADetail from '../../../../hooks/useSaveParameterSLA';
import { MODAL as PROCESS_SLA_MODAL } from '../../TabProcess.constant';


interface useEditProcessSLAModalProps {
  id: string;
}

const useEditProcessSLAModal = (props: useEditProcessSLAModalProps, form: any) => {
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const { processId, isBucketProcessId, mode } = useMasterParameter();
  const { recordActivity } = useRecordLog();

  const parameterSLADetail = useGetParameterSLADetail({
    id: String(props.id),
  });
  const parameterSLASubmissionDetail = useGetParameterSLASubmissionDetail({
    bucketProcessId: processId,
  }, { enabled: isBucketProcessId });
  const { data: parameterSLADetailData, isFetching: isLoading } =
    isBucketProcessId
      ? parameterSLASubmissionDetail
      : parameterSLADetail;

  const { mutate: saveParameterSLADetail } = useSaveParameterSLADetail({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: data?.content.bucketProcessId || '',
        changeAfter: JSON.stringify(data?.content),
        changeBefore: JSON.stringify(parameterSLADetailData?.content),
        menuCode: 'parameter-sla',
        module: TypeModule.PARAMETER_SLA,
        process: TypeProcess.PARAMETER_SLA,
        remarks: 'Successfully Saved Parameter SLA Process',
      });

      showNiceModalV2({
        onClose: () => {
          closeNiceModal(PROCESS_SLA_MODAL.EDIT_PROCESS_SLA_MODAL);
          closeNiceModal(MODAL.GLOBAL.SUCCESS).then(() => {
            if (mode !== 'submission') {
              const nextPath = replacePath(`${MASTER_PARAMETER.PARAMETER_SLA_DETAIL_PAGE}?tab=${TAB.PROCESS}`, {
                mode: 'submission',
                processId: data?.content.bucketProcessId,
              });
              router.push(nextPath);
            } else {
              queryClient.invalidateQueries({ queryKey: ['parameter-sla-group-detail']});
              queryClient.invalidateQueries({ queryKey: ['parameter-sla-submission-detail']});
              queryClient.invalidateQueries({ queryKey: ['parameter-sla-summary']});
            }
          });
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnSave = (payload) => {
    showNiceModalV2({
      onClose: () => {
        closeNiceModal(MODAL.GLOBAL.WARNING);
      },
      onSubmit: () => {
        const hasBucketProcessId = isBucketProcessId || !parameterSLADetailData.bucketProcessId;

        saveParameterSLADetail({
          ...(hasBucketProcessId ? {
            bucketProcessId: parameterSLADetailData.bucketProcessId || processId,
            id: null,
          } : {
            bucketProcessId: null,
            id: props.id,
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
    const base = parameterSLADetailData?.content || {};

    const hasBucketProcessId =
    isBucketProcessId || !base.bucketProcessId;

    return Promise.resolve({
      ...base,

      ...(hasBucketProcessId
        ? {
          bucketProcessId: base.bucketProcessId || processId,
          id: null,
        }
        : {
          bucketProcessId: base.bucketProcessId ?? null,
          id: props.id,
        }),

      groupDivision: watchedValues.groupDivision,
      isActive: watchedValues.isActive,
      module: base.module,

      moduleLabel: base.moduleLabel,


      process: base.process,
      processLabel: base.processLabel,
      slaDeadline: Number(watchedValues.slaDeadline),
      stage: watchedValues.stage,
    });
  }, [
    watchedValues,
    parameterSLADetailData,
    processId,
    isBucketProcessId,
    props.id,
  ]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!parameterSLADetailData && parameterSLADetailData?.content?.isEditable === true,
    payload: autoSavePayload,
    url: 'parameter.parameterSla.store',
  });

  return {
    defaultData: parameterSLADetailData?.content,
    handleOnSave,
    isAutoSaveFetching,
    isLoading,
  };
};

export default useEditProcessSLAModal;
