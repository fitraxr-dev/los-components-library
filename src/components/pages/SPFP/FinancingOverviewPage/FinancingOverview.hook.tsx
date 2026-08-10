import { useContext, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import useGetDetailFinancingOverview from './hooks/useGetDetailFinancingOverview';
import useSaveFinancingOverview from './hooks/useSaveFinancingOverview';


export const useFinancingOverview = () => {
  const { goToNextStep } = useSpfpContext();
  const bucket = useSpfpBucketContext();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const queryClient = useQueryClient();
  const [remark, setRemark] = useState('');
  const [shouldGoNext, setShouldGoNext] = useState(false);

  const {
    data: financingOverviewDetail,
    isLoading: isFinancingDetailLoading,
  } = useGetDetailFinancingOverview({
    ...bucket,
  });

  useEffect(() => {
    if (financingOverviewDetail && !isFinancingDetailLoading) {
      setRemark(financingOverviewDetail?.remark);
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `view financing overview detail for bucket: ${bucket?.bucketProcessId}`,
      });
    }
  }, [financingOverviewDetail, isFinancingDetailLoading, bucket, recordActivity]);

  useEffect(() => {
    if (remark !== financingOverviewDetail?.remark) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [remark, financingOverviewDetail?.remark, setDirtyMsg]);

  const { isPending: isSaveLoading, mutate: saveFinancingOverview } = useSaveFinancingOverview({
    onError: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: JSON.stringify({ remark: financingOverviewDetail?.remark || '' }),
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `failed to save financing overview for bucket: ${bucket?.bucketProcessId}`,
      });
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: JSON.stringify({ remark: remark || '' }),
        changeBefore: JSON.stringify({ remark: financingOverviewDetail?.remark || '' }),
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `successfully saved financing overview for bucket: ${bucket?.bucketProcessId}`,
      });
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({
        queryKey: ['financing-overview'],
      });
      showNiceModalV2({
        onClose: () => {
          if (shouldGoNext) {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: bucket?.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              module: bucket?.module || '',
              process: bucket?.process || '',
              remarks: `navigate to next step after saving financing overview for bucket: ${bucket?.bucketProcessId}`,
            });
            goToNextStep();
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = () => {
    if (viewOnly) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: 'navigate to next step from financing overview (view only mode)',
      });
      goToNextStep();
    } else {
      if (!!remark) {
        const saveData = {
          bucketProcessId: bucket?.bucketProcessId || undefined,
          id: financingOverviewDetail?.id || undefined,
          module: bucket.module || undefined,
          process: bucket.process || undefined,
          remark: remark || undefined,
        };
        recordActivity({
          activity: ActivityType.SAVE,
          bucketProcessId: bucket?.bucketProcessId,
          changeAfter: JSON.stringify(saveData),
          changeBefore: JSON.stringify({ remark: financingOverviewDetail?.remark || '' }),
          module: bucket?.module,
          process: bucket?.process,
          remarks: `initiate save financing overview for bucket: ${bucket?.bucketProcessId}`,
        });
        saveFinancingOverview(saveData);
      } else {
        showNiceModalV2({
          cancelText: 'Tidak',
          onCancel: () => {
            recordActivity({
              activity: ActivityType.CANCEL,
              bucketProcessId: bucket?.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              module: bucket?.module || '',
              process: bucket?.process || '',
              remarks: `cancel save financing overview without remark for bucket: ${bucket?.bucketProcessId}`,
            });
          },
          onSubmit: () => {
            recordActivity({
              activity: ActivityType.SAVE,
              bucketProcessId: bucket?.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              module: bucket?.module || '',
              process: bucket?.process || '',
              remarks: `confirm save financing overview without remark for bucket: ${bucket?.bucketProcessId}`,
            });
            saveFinancingOverview({
              bucketProcessId: bucket?.bucketProcessId || undefined,
              id: financingOverviewDetail?.id || undefined,
              module: bucket.module || undefined,
              process: bucket.process || undefined,
              remark: '',
            });
          },
          submitText: 'Ya',
          title: 'Data mandatory belum terisi, simpan perubahan?',
          type: 'warning',
        });
      }
    }
  };

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
