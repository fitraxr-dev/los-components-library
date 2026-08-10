import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSaveBucketDetail from '@/hooks/services/useSaveBucketDetail';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useESDDContext } from '@/components/layouts/EsddLayout/Esdd.context';
import { useESDDAccess } from '@/components/pages/Review/ESDDPage/hooks/useESDDAccess';


import useGetDetailFinancingOverview from './hooks/useGetDetailFinancingOverview';
import useSaveFinancingFacilityDescription from './hooks/useSaveFinancingFacilityDescription';


const validationScheme = Yup.object({
  typePermohonan: Yup.string().nullable(),
  typePermohonanRemark: Yup.string().nullable(),
});

export const useFinancingOverview = () => {
  const { setDirtyMsg } = useContext(DirtyContext);
  const { processId }: { processId: string } = useParams();
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const { goToNextStep } = useESDDContext();
  const [container, setContainer] = useState(null);
  const { parentId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const {
    hasAnyViewAccess,
    hasAnyUpdateAccess,
  } = useESDDAccess();

  const canView = hasAnyViewAccess();
  const canUpdate = hasAnyUpdateAccess();

  const {
    watch,
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

  const { data: typeSubmissionData } = useGetParameterList('typeSubmission');
  const [remark, setRemark] = useState('');

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DELST,
  });

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
    process: TypeProcess.REVIEWER_DELST,
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
        typePermohonan: debtorInfoData?.typeSubmission || '',
        typePermohonanRemark: debtorInfoData?.remarks || '',
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
      reset({
        typePermohonan: debtorInfoData?.typeSubmission ?? '',
        typePermohonanRemark: debtorInfoData?.remarks ?? '',
      });
    }
  }, [debtorInfoData]);

  useEffect(() => {
    if (debtorInfoData) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: String(processId),
        changeAfter: JSON.stringify(debtorInfoData),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'view financing overview detail page',
      });
    }
  }, [debtorInfoData, processId, recordActivity]);

  const { isPending: isSaveLoading, mutateAsync: saveFinancingOverview } = useSaveBucketDetail({});

  const {
    isPending: isSaveDescriptionLoading,
    mutateAsync: saveFinancingOverviewDescription,
  } = useSaveFinancingFacilityDescription({});

  const handleSave = async (data: any, options?: { goToNext?: boolean }) => {
    const { goToNext = false } = options || {};

    const docx = await convertToDocx(container);

    const descriptionPayload = {
      bucketProcessId: String(processId),
      description: docx,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remark: financingOverviewDetail?.remark,
    } as const;

    const bucketDetailPayload = {
      bucketProcessId: String(processId),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: data.typePermohonanRemark,
      typeFinancing: debtorInfoData.financeType,
      typeProcess: debtorInfoData.typeProcess,
      typeSubmission: data.typePermohonan,
    } as const;

    const runSaves = async () => {
      const [descRes] = await Promise.all([
        saveFinancingOverviewDescription(descriptionPayload),
        saveFinancingOverview(bucketDetailPayload),
      ]);

      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(descRes?.data?.content || {}),
        changeBefore: JSON.stringify(financingOverviewDetail || syncfusionFinancingOverviewDetail || {}),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'save financing overview',
      });

      if (goToNext) {
        goToNextStep();
      }
    };

    const hasChanges = isDirty || watch('typePermohonanRemark') || watch('typePermohonan');

    if (hasChanges) {
      await runSaves();
    } else {
      showNiceModalV2({
        onSubmit: () => {
          runSaves().catch(() => { });
        },
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


  // Auto-save payload
  const autoSavePayload = useMemo(() => async () => {
    if (!container && !watchedValues.typePermohonan && !watchedValues.typePermohonanRemark && !remark) {
      return Promise.resolve(null);
    }

    const docx = container ? await convertToDocx(container) : syncfusionFinancingOverviewDetail?.description || '';

    const payload = {
      bucketProcessId: String(processId),
      description: docx,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remark: financingOverviewDetail?.remark,
    };

    if (watchedValues.typePermohonan || watchedValues.typePermohonanRemark) {
      setNeedSecondSave(true);
    }

    return Promise.resolve(payload);
  }, [container,
    remark,
    processId,
    watchedValues,
    syncfusionFinancingOverviewDetail?.description,
    financingOverviewDetail]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly &&
                  canUpdate &&
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

    saveFinancingOverviewBucket({
      bucketProcessId: String(processId),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: watchedValues.typePermohonanRemark ?? null,
      typeFinancing: debtorInfoData?.typeFinancing,
      typeProcess: debtorInfoData?.typeProcess,
      typeSubmission: watchedValues.typePermohonan,
    });

  }, [
    isAutoSaveFetching,
    debtorInfoData,
    financingOverviewDetail,
  ]);

  return {
    canUpdate,
    canView,
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
    handleSave,
    handleSaveAndNext,
    handleSaveOnly,
    handleSubmit,
    isAutoSaveFetching,
    isSaveDescriptionLoading,
    isSaveLoading,
    isSyncfusionFetchLoading,
    needCheckMaster,
    parentId,
    remark,
    setContainer,
    setRemark,
    setValue,
    syncfusionFinancingOverviewDetail,
    theme,
    typeSubmissionData,
    viewOnly,
  };
};
