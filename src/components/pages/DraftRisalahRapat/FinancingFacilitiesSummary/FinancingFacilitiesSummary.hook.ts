import { useCallback, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailFinancingOverview from '@/hooks/services/mip/financing-facility/useGetDetailFinancingOverview';
import useSaveFinancingOverview from '@/hooks/services/mip/financing-facility/useSaveFinancingOverview';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useRisalahRapatLayout from '@/components/layouts/RisalahRapatLayout/RisalahRapatLayout.hooks';


export const useFinancingFacilitiesSummary = () => {
  const { goToNextStep } = useRisalahRapatLayout();
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();
  const [remark, setRemark] = useState('');
  const [shouldGoNext, setShouldGoNext] = useState(false);

  const bucket = useMemo(() => ({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  }), [processId]);

  const {
    data: financingOverviewDetail,
    isLoading: isFinancingDetailLoading,
  } = useGetDetailFinancingOverview(bucket);

  useEffect(() => {
    if (financingOverviewDetail && !isFinancingDetailLoading) {
      setRemark(financingOverviewDetail?.remark || '');
    }
  }, [financingOverviewDetail, isFinancingDetailLoading]);

  const { isPending: isSaveLoading, mutate: saveFinancingOverview } = useSaveFinancingOverview({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['financing-overview'],
      });
      showNiceModalV2({
        onClose: () => {
          if (shouldGoNext) {
            goToNextStep();
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = useCallback(() => {
    if (viewOnly) {
      goToNextStep();
    } else {
      const saveData = {
        bucketProcessId: bucket?.bucketProcessId || undefined,
        id: financingOverviewDetail?.id || undefined,
        module: bucket.module || undefined,
        process: bucket.process || undefined,
        remark: remark || '',
      };

      if (remark) {
        saveFinancingOverview(saveData);
      } else {
        showNiceModalV2({
          cancelText: 'Tidak',
          onSubmit: () => {
            saveFinancingOverview(saveData);
          },
          submitText: 'Ya',
          title: 'Data mandatory belum terisi, simpan perubahan?',
          type: 'warning',
        });
      }
    }
  }, [viewOnly, remark, bucket, financingOverviewDetail, goToNextStep, saveFinancingOverview]);

  const autoSavePayload = useMemo(() => () => {
    if (!bucket?.bucketProcessId) return Promise.resolve(null);

    return Promise.resolve({
      bucketProcessId: bucket?.bucketProcessId || undefined,
      id: financingOverviewDetail?.id || undefined,
      module: bucket.module || undefined,
      process: bucket.process || undefined,
      remark: remark || undefined,
    });
  }, [remark, bucket, financingOverviewDetail]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'mip.financingFacility.save',
  });

  return {
    goToNextStep,
    handleSave,
    isAutoSaveFetching,
    isFinancingDetailLoading,
    isSaveLoading,
    remark,
    setRemark,
    setShouldGoNext,
  };
};
