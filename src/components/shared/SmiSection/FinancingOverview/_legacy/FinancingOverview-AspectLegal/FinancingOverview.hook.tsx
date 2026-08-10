'use client';

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSaveBucketDetail from '@/hooks/services/useSaveBucketDetail';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


import { AspectLegalReviewContext } from '@/components/layouts/AspectLegalReviewLayout/AspectLegalReview.context';
import { useLegalAspectAccess } from '@/components/pages/Review/AspectLegalReview/hooks/useLegalAspectAccess';

import useGetDetailFinancingOverview from './hooks/useGetDetailFinancingOverview';
import useSaveFinancingOverview from './hooks/useSaveFinancingOverview';


const validationScheme = Yup.object({
  typePermohonan: Yup.string().required('Tipe Permohonan tidak boleh kosong'),
  typePermohonanRemark: Yup.string().nullable(),
});

export const useFinancingOverview = () => {
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { viewOnly } = useViewOnly();
  const [container, setContainer] = useState(null);
  const { goToNextStep } = useContext(AspectLegalReviewContext);
  const { parentId, processId } = useIdentity();
  const queryClient = useQueryClient();

  const {
    hasAnyUpdateAccess: canUpdateFinancingOverview,
  } = useLegalAspectAccess();

  const needCheckMaster = useMemo(() => {
    let checkMaster = false;

    const actions = {};
    if (processId && JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('NEED_CHECK_MASTER')) {
      checkMaster = true;
    }
    return checkMaster;
  }, [processId]);

  const [dataDelta, setDataDelta] = useState<{
    differencesData: Array<{ key: string }>;
    previousData: Record<string, any>;
  } | null>(null);


  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DH,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { typePermohonan: '', typePermohonanRemark: '' },
    mode: 'onChange',
    resolver: yupResolver(validationScheme),
  });

  const { data: typeSubmissionData } = useGetParameterList('typeSubmission');
  const [remark, setRemark] = useState('');
  const {
    data: financingOverviewDetail,
  } = useGetDetailFinancingOverview({
    bucketProcessId: parentId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
  });

  const {
    data: syncfusionFinancingOverviewDetail,
    isFetching: isSyncfusionFetchLoading,
  } = useGetDetailFinancingOverview({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DH,
  });

  const changeBgInput = (inputKey: string) => {
    let color = '#FFFFFF';
    if (dataDelta?.differencesData?.some((el) => el?.key === inputKey) && needCheckMaster) {
      color = '#FCE6E8';
    }
    return color;
  };

  const findDataMaster = (inputKey: string) => {
    if (typeof dataDelta?.previousData === 'object' && dataDelta?.previousData !== null && needCheckMaster) {
      return dataDelta.previousData[inputKey] || '';
    }
    return '';
  };

  const findLabelTypeSubmission = (value: string) => {
    const found = typeSubmissionData?.find((item) => item.value === value);
    return found ? found.label : value;
  };

  useEffect(() => {
    if (financingOverviewDetail) {
      setRemark(financingOverviewDetail?.remark || '');
    }
  }, [financingOverviewDetail]);

  useEffect(() => {

    const currentRemark = remark || '';
    const originalRemark = financingOverviewDetail?.remark || '';
    const isRemarkChanged = currentRemark !== originalRemark;

    if (isRemarkChanged || isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [remark, financingOverviewDetail?.remark, isDirty, setDirtyMsg]);


  useEffect(() => {
    if (debtorInfoData) {
      reset({ typePermohonan: debtorInfoData?.typeSubmission ?? '', typePermohonanRemark: debtorInfoData?.description ?? '' });
    }
  }, [debtorInfoData, reset]);


  useEffect(() => {
    if (needCheckMaster) {
      const previousData = {
        typePermohonan: debtorInfoData?.typeSubmission ?? '',
        typePermohonanRemark: debtorInfoData?.description ?? '',
      };

      const differencesData = [
        { key: 'typePermohonan' },
        { key: 'typePermohonanRemark' },
      ];

      setDataDelta({ differencesData, previousData });
    } else {
      setDataDelta(null);
    }
  }, [needCheckMaster, debtorInfoData]);
  // ================================================================

  // Save
  const { isPending: isSaveLoading, mutate: saveFinancingOverview } = useSaveFinancingOverview({
    onError: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' });
    },
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['detail-additional', { bucketProcessId: processId }]});
      // Show modal
      showNiceModalV2({ type: 'success' });
    },
  });


  const handleSave = async (data: any, options?: { goToNext?: boolean }) => {
    const { goToNext = false } = options || {};

    const file = await convertToDocx(container);

    const hasChanges = isDirty || watch('typePermohonanRemark') || watch('typePermohonan');

    const saveAction = () => {
      saveFinancingOverview({
        bucketProcessId: String(processId),
        description: file,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DH,
        remark: financingOverviewDetail?.remark,
        remarks: data.typePermohonanRemark ?? null,
        typeFinancing: debtorInfoData?.typeFinancing,
        typeProcess: debtorInfoData?.typeProcess,
        typeSubmission: data.typePermohonan,
      }, {
        onSuccess: () => {
          if (goToNext) {
            goToNextStep();
          }
        },
      });
    };

    if (hasChanges) {
      saveAction();
    } else {
      showNiceModalV2({
        onSubmit: saveAction,
        title: 'Tidak ada perubahan pada form ini, apakah anda yakin ingin melanjutkan?',
        type: 'warning',
      });
    }
  };

  const handleSaveOnly = (data: any) => handleSave(data, { goToNext: false });
  const handleSaveAndNext = (data: any) => handleSave(data, { goToNext: true });

  const handleNext = () => goToNextStep();

  const watchedValues = watch();
  const [needSecondSave, setNeedSecondSave] = useState(false);
  const { isPending: isSaveBucketLoading, mutate: saveFinancingOverviewBucket } = useSaveBucketDetail({});

  const watchedTypePermohonan = watch('typePermohonan');
  const watchedTypePermohonanRemark = watch('typePermohonanRemark');

  // Auto-save payload
  const autoSavePayload = useMemo(() => async () => {
    if (!container && !watchedTypePermohonan && !watchedTypePermohonanRemark && !remark) {
      return Promise.resolve(null);
    }

    const docx = container
      ? await convertToDocx(container)
      : syncfusionFinancingOverviewDetail?.description || '';

    const payload = {
      bucketProcessId: String(processId),
      description: docx,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      remark: financingOverviewDetail?.remark,
    };

    if (watchedTypePermohonan || watchedTypePermohonanRemark) {
      setNeedSecondSave(true);
    }

    return Promise.resolve(payload);
  }, [container,
    remark,
    processId,
    watchedTypePermohonan,
    watchedTypePermohonanRemark,
    syncfusionFinancingOverviewDetail?.description,
    financingOverviewDetail]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly &&
                canUpdateFinancingOverview &&
                !!processId,
    payload: autoSavePayload,
    url: 'mip.financingFacilityOverview.save',
  });


  const lastAutoSaveAt = useRef<number>(0);
  const prevAutoSaveFetchingRef = useRef<boolean>(false);

  useEffect(() => {
  // Deteksi transisi
    const hasJustFinished = prevAutoSaveFetchingRef.current === true && isAutoSaveFetching === false;

    // Update ref untuk render berikutnya
    prevAutoSaveFetchingRef.current = isAutoSaveFetching;

    if (!hasJustFinished) return;
    if (!debtorInfoData || !processId) return;

    // 3. Debounce manual (Mencegah double-hit dalam waktu sangat singkat)
    const now = Date.now();
    if (now - lastAutoSaveAt.current < 1000) return;
    lastAutoSaveAt.current = now;

    saveFinancingOverviewBucket({
      bucketProcessId: String(processId),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      remarks: watchedTypePermohonanRemark ?? null,
      typeFinancing: debtorInfoData?.typeFinancing,
      typeProcess: debtorInfoData?.typeProcess,
      typeSubmission: watchedTypePermohonan,
    });

  }, [
    isAutoSaveFetching,
  ]);
  return {
    canUpdateFinancingOverview,
    changeBgInput,
    container,
    control,
    findDataMaster,
    findLabelTypeSubmission,
    handleNext,
    handleSaveAndNext,
    handleSaveOnly,
    handleSubmit,
    isAutoSaveFetching,
    isSaveLoading,
    isSyncfusionFetchLoading,
    needCheckMaster,
    parentId,
    remark,
    setContainer,
    setRemark,
    syncfusionFinancingOverviewDetail,
    typeSubmissionData,
    viewOnly,
  };
};
