import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
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

import { useEligibilityReviewContext } from '@/components/layouts/EligibilityReviewLayout/EligibilityReview.context';
import {
  useEligibilityReviewAccess,
} from '@/components/pages/Review/EligibilityReview/hooks/useEligibilityReviewAccess';

import useGetDetailFinancingOverview from './hooks/useGetDetailFinancingOverview';
import useSaveFinancingOverview from './hooks/useSaveFinancingOverview';


const validationScheme = Yup.object({
  typePermohonan: Yup.string().required('Tipe Permohonan tidak boleh kosong'),
  typePermohonanRemark: Yup.string().nullable(),
});

export const useFinancingOverview = () => {
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { parentId } = useIdentity();
  const { processId }: { processId: string } = useParams();
  const { viewOnly } = useViewOnly();
  const { goToNextStep } = useEligibilityReviewContext();
  const [container, setContainer] = useState(null);
  const [remark, setRemark] = useState('');
  const queryClient = useQueryClient();

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { typePermohonan: '', typePermohonanRemark: '' },
    mode: 'onChange',
    resolver: yupResolver(validationScheme),
  });

  const {
    hasAnyUpdateAccess: canUpdateFinancingOverview,
  } = useEligibilityReviewAccess();

  const { data: typeSubmissionData } = useGetParameterList('typeSubmission');

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DEPI,
  });

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
    process: TypeProcess.REVIEWER_DEPI,
  });


  const [dataDelta, setDataDelta] = useState<{
    differencesData: Array<{ key: string }>;
    previousData: Record<string, any>;
  } | null>(null);

  const needCheckMaster = useMemo(() => {
    let checkMaster = false;

    const actions = {};
    if (processId && JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('NEED_CHECK_MASTER')) {
      checkMaster = true;
    }
    return checkMaster;
  }, [processId]);

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
    if (debtorInfoData) {
      reset({
        typePermohonan: debtorInfoData?.typeSubmission ?? '',
        typePermohonanRemark: debtorInfoData?.description ?? '',
      });
    }
  }, [debtorInfoData, reset]);

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

  const { isPending: isSaveLoading, mutate: saveFinancingOverview } = useSaveFinancingOverview({
    onError: () => {
      // Reset dirty state
      setDirtyMsg(undefined);
      // Show modal
      showNiceModalV2({ title: 'Proses simpan gagal, silakan coba beberapa saat lagi.', type: 'error' });
    },
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);
      setRemark(financingOverviewDetail?.remark || '');
      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
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
        process: TypeProcess.REVIEWER_DEPI,
        remark: remark,
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
  const lastAutoSaveAt = useRef<number>(0);
  const { isPending: isSaveBucketLoading, mutate: saveFinancingOverviewBucket } = useSaveBucketDetail({});

  const watchTypePermohonan = watch('typePermohonan');
  const watchTypePermohonanRemark = watch('typePermohonanRemark');
  const initialDescriptionRef = useRef<string>('');

  useEffect(() => {
    if (syncfusionFinancingOverviewDetail?.description && !initialDescriptionRef.current) {
      initialDescriptionRef.current = syncfusionFinancingOverviewDetail.description;
    }
  }, [syncfusionFinancingOverviewDetail?.description]);

  // Auto-save payload
  const autoSavePayload = useMemo(() => async () => {
    if (!container && !watchTypePermohonan && !watchTypePermohonanRemark && !remark) {
      return Promise.resolve(null);
    }

    const docx = container
      ? await convertToDocx(container)
      : initialDescriptionRef.current || '';

    if (watchTypePermohonan || watchTypePermohonanRemark) {
      setNeedSecondSave(true);
    }

    return Promise.resolve({
      bucketProcessId: String(processId),
      description: docx,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      remark: remark,
    });
  }, [
    container,
    remark,
    processId,
    watchTypePermohonan,
    watchTypePermohonanRemark,
  ]);

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

  const hasSavedBucketRef = useRef(false);
  const prevIsFetchingRef = useRef<boolean | null>(null);
  useEffect(() => {
    hasSavedBucketRef.current = false;
  }, [watchTypePermohonan, watchTypePermohonanRemark, remark, container]);

  useEffect(() => {
    const justFinished = prevIsFetchingRef.current === true && isAutoSaveFetching === false;
    prevIsFetchingRef.current = isAutoSaveFetching;

    if (!justFinished) return;
    if (!debtorInfoData) return;
    if (hasSavedBucketRef.current) return;

    hasSavedBucketRef.current = true;

    saveFinancingOverviewBucket({
      bucketProcessId: String(processId),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      remarks: watchTypePermohonanRemark ?? null,
      typeFinancing: debtorInfoData?.typeFinancing,
      typeProcess: debtorInfoData?.typeProcess,
      typeSubmission: watchTypePermohonan,
    });

  }, [isAutoSaveFetching, debtorInfoData]);

  return {
    canUpdateFinancingOverview,
    changeBgInput,
    container,
    control,
    dataDelta,
    financingOverviewDetail,
    findDataMaster,
    findLabelTypeSubmission,
    goToNextStep,
    handleNext,
    handleSaveAndNext,
    handleSaveOnly,
    handleSubmit,
    isAutoSaveFetching,
    isSaveLoading,
    isSyncfusionFetchLoading,
    needCheckMaster,
    setContainer,
    setRemark,
    syncfusionFinancingOverviewDetail,
    typeSubmissionData,
    viewOnly,
  };
};
