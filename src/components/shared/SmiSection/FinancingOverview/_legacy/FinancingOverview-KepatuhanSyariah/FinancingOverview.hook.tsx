import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSaveBucketDetail from '@/hooks/services/useSaveBucketDetail';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


import { useESDDContext } from '@/components/layouts/EsddLayout/Esdd.context';
import {
  useShariahComplianceAccess,
} from '@/components/pages/Review/KepatuhanSyariah/hooks/useShariahComplianceAccess';

import useGetDetailFinancingOverview from './hooks/useGetDetailFinancingOverview';
import useSaveFinancingFacilityDescription from './hooks/useSaveFinancingFacilityDescription';


const validationScheme = Yup.object({
  typePermohonan: Yup.string().required('Tipe Permohonan tidak boleh kosong'),
  typePermohonanRemark: Yup.string().nullable(),
});

export const useFinancingOverview = () => {
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { processId }: { processId: string } = useParams();
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const goToNextStep = useGoToNextStep();
  const [container, setContainer] = useState(null);
  const { parentId } = useIdentity();
  const [remark, setRemark] = useState('');
  const queryClient = useQueryClient();

  const {
    watch,
    register,
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { typePermohonan: '', typePermohonanRemark: '' },
    mode: 'onChange',
    resolver: yupResolver(validationScheme),
  });

  const {
    hasAnyUpdateAccess: canUpdateFinancingOverview,
  } = useShariahComplianceAccess();

  const { data: typeSubmissionData } = useGetParameterList('typeSubmission');

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DK,
  });

  console.log('detail: ', debtorInfoData);

  const {
    data: financingOverviewDetail,
  } = useGetDetailFinancingOverview({
    bucketProcessId: debtorInfoData?.bucketParentId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
  });

  const {
    data: syncfusionFinancingOverviewDetail,
    isFetching: isSyncfusionFetchLoading,
  } = useGetDetailFinancingOverview({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DK,
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
        typePermohonanRemark: debtorInfoData?.remarks ?? '',
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
      const newData = {
        typePermohonan: debtorInfoData?.typeSubmission ?? '',
        typePermohonanRemark: debtorInfoData?.remarks ?? '',
      };
      reset(newData);
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

  const { isPending: isSaveLoading, mutate: saveFinancingOverview } = useSaveBucketDetail({});

  const {
    isPending: isSaveDescriptionLoading,
    mutate: saveFinancingOverviewDescription,
  } = useSaveFinancingFacilityDescription({
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

  const watchedValues = watch();
  const [needSecondSave, setNeedSecondSave] = useState(false);
  const prevAutoSaveFetching = useRef(false);
  const lastAutoSaveAt = useRef<number>(0);


  // Auto-save payload - untuk mip.financingFacilityOverview.save
  const autoSavePayload = useMemo(() => async () => {
    if (!container && !watchedValues.typePermohonan && !watchedValues.typePermohonanRemark && !remark) {
      return Promise.resolve(null);
    }

    const docx = container ? await convertToDocx(container) : syncfusionFinancingOverviewDetail?.description || '';

    const payload = {
      bucketProcessId: String(processId),
      description: docx,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      remark: remark,
    };

    // Set flag bahwa perlu second save jika ada perubahan form
    if (watchedValues.typePermohonan || watchedValues.typePermohonanRemark) {
      setNeedSecondSave(true);
    }

    return Promise.resolve(payload);
  }, [container, remark, processId, watchedValues, syncfusionFinancingOverviewDetail?.description]);

  // Auto-save hook pertama - mip.financingFacilityOverview.save
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


  useEffect(() => {
    if (!debtorInfoData) return;
    if (isAutoSaveFetching) return;

    const now = Date.now();

    // prevent double call in short time
    if (now - lastAutoSaveAt.current < 500) return;

    lastAutoSaveAt.current = now;

    saveFinancingOverview({
      bucketProcessId: String(processId),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      remarks: watchedValues.typePermohonanRemark ?? null,
      typeFinancing: debtorInfoData?.financeType,
      typeProcess: debtorInfoData?.typeProcess,
      typeSubmission: watchedValues.typePermohonan,
    });

  }, [
    isAutoSaveFetching,
    debtorInfoData,
  ]);


  const handleSave = async (data: any, options?: { goToNext?: boolean }) => {
    const { goToNext = false } = options || {};

    const docx = await convertToDocx(container);

    const hasChanges = isDirty || watch('typePermohonanRemark') || watch('typePermohonan');

    const saveAction = () => {

      saveFinancingOverviewDescription({
        bucketProcessId: String(processId),
        description: docx,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DK,
        remark: remark,
      }, {
        onSuccess: () => {
          saveFinancingOverview({
            bucketProcessId: String(processId),
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DK,
            remarks: data.typePermohonanRemark ?? null,
            typeFinancing: debtorInfoData?.financeType,
            typeProcess: debtorInfoData?.typeProcess,
            typeSubmission: data.typePermohonan,
          }, {
            onSuccess: () => {
              if (goToNext) {
                goToNextStep();
              }
            },
          });
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

  const isLoading = isSaveLoading || isSaveDescriptionLoading;

  return {
    canUpdateFinancingOverview,
    changeBgInput,
    container,
    control,
    dataDelta,
    debtorInfoData,
    errors,
    financingOverviewDetail,
    findDataMaster,
    findLabelTypeSubmission,
    getValues,
    goToNextStep,
    handleNext,
    handleSaveAndNext,
    handleSaveOnly,
    handleSubmit,
    isAutoSaveFetching,
    isDirty,
    isLoading,
    isSaveLoading,
    isSyncfusionFetchLoading,
    needCheckMaster,
    parentId,
    register,
    saveFinancingOverviewDescription,
    setContainer,
    setValue,
    syncfusionFinancingOverviewDetail,
    theme,
    typeSubmissionData,
    viewOnly,
  };
};
