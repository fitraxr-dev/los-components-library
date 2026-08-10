'use client';
import { useContext, useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useApplicationDetail from './hooks/useApplicationDetail';
import useApplicationSave from './hooks/useApplicationSave';


const useApplication = () => {
  const { processId } = useIdentity();
  const goToNextStep = useGoToNextStep();
  const { viewOnly } = useViewOnly();
  const [container, setContainer] = useState(null);
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    remarks: yup.string(),
    typeSubmission: yup.string().required('Type Permohonan is Required'),
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    watch,
  } = useForm({
    defaultValues: { remarks: '', typeSubmission: '' },
    resolver: yupResolver(validationSchema),
  });

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.ENGAGEMENT_AGREEMENT,
  });
  const {
    data: application,
    isLoading: isLoadingDetail,
  } = useApplicationDetail({
    bucketProcessId: String(processId),
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.ENGAGEMENT_AGREEMENT,
  });
  const { data: typeSubmissionData } = useGetParameterList(Modules.TYPE_SUBMISSION);

  useEffect(() => {
    if (debtorInfoData)
      reset({
        remarks: debtorInfoData?.remarks,
        typeSubmission: debtorInfoData?.typeSubmission,
      });
  }, [debtorInfoData]);

  const { mutate: mutateSave, isPending: isLoading } = useApplicationSave({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' }),
    onSuccess: () => {
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['pengajuan-perikatan-permohonan-detail', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
    },
  });

  const { mutate: mutateSaveAndNext, isPending: isLoadingSaveAndNext } = useApplicationSave({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' }),
    onSuccess: () => {
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['pengajuan-perikatan-permohonan-detail', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      showNiceModalV2({ onClose: () => goToNextStep(), type: 'success' });
    },
  });

  const watchedValues = watch();

  const autoSavePayload = useMemo(() => async () => {
    if (!container) return null;

    const disclaimer = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description: disclaimer,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.ENGAGEMENT_AGREEMENT,
      remarks: watchedValues.remarks,
      typeFinancing: debtorInfoData?.financeType,
      typeProcess: debtorInfoData?.typeProcess,
      typeSubmission: watchedValues.typeSubmission,
    };
  }, [container, processId, watchedValues, debtorInfoData]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    isActive: !viewOnly && !!debtorInfoData && !!container,
    payload: autoSavePayload,
    url: 'agreement.add.savePk',
  });

  const handleSave = async (data: any) => {
    const disclaimer = await convertToDocx(container);
    mutateSave({
      bucketProcessId: processId,
      dataSource: debtorInfoData?.dataSource,
      description: disclaimer,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.ENGAGEMENT_AGREEMENT,
      remarks: data.remarks,
      typeFinancing: debtorInfoData.financeType,
      typeProcess: debtorInfoData?.typeProcess,
      typeSubmission: data.typeSubmission,
    });
  };

  const handleSaveAndNext = async (data: any) => {
    const disclaimer = await convertToDocx(container);
    mutateSaveAndNext({
      bucketProcessId: processId,
      description: disclaimer,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.ENGAGEMENT_AGREEMENT,
      remarks: data.remarks,
      typeFinancing: debtorInfoData.financeType,
      typeProcess: debtorInfoData?.typeProcess,
      typeSubmission: data.typeSubmission,
    });
  };


  const handleNext = () => goToNextStep();

  return {
    application,
    container,
    control,
    handleNext,
    handleSave,
    handleSaveAndNext,
    handleSubmit,
    isAutoSaveFetching,
    isDirty,
    isLoading: isLoading || isLoadingSaveAndNext,
    isLoadingDetail,
    isValid,
    setContainer,
    typeSubmissionData,
    viewOnly,
  };
};

export default useApplication;
