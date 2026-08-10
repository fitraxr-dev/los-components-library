import { useContext, useEffect, useMemo, useState } from 'react';

import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { ONE_MINUTE } from '@/configs/constants';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { CreditCheckingContext } from '../../CreditCheckingResult.context';

import useGetDebtorRemark from './hooks/useGetDebtorRemark';
import useSaveDebtorRemark from './hooks/useSaveDebtorRemark';


const useDebtorHook = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { activeTab, setActiveTab } = useContext(CreditCheckingContext);
  const { setDirtyMsg } = useContext(DirtyContext);
  const router = useCustomRouter();
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const queryClient = useQueryClient();

  const { control, reset, handleSubmit: handleSubmitForm, getValues, formState: { isDirty } } = useForm({
    defaultValues: {
      remark: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [isDirty, setDirtyMsg]);

  const {
    data: debtorRemark,
  } = useGetDebtorRemark({
    bucketProcessId: processId,
    module: TypeModule.ANNUAL_REVIEW,
    process: TypeProcess.ANNUAL_REVIEW,
  }, {
    enabled: activeTab === 0,
    staleTime: ONE_MINUTE,
  });

  useEffect(() => {
    if (debtorRemark?.remark) {
      reset({
        remark: debtorRemark.remark ?? '',
      });
    }
  }, [debtorRemark?.remark, reset]);

  const { isPending: isSaveLoading, mutate } = useSaveDebtorRemark({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mns-debtor-remark']});
      showNiceModalV2({ type: 'success' });
      setDirtyMsg(undefined);
      if (shouldGoNext) {
        setShouldGoNext(false);
        setActiveTab(1);
        return;
      }
    },
  });

  const handleSubmit = (data: any) => {
    if (viewOnly) {
      setActiveTab(1);
    } else {
      mutate({
        bucketProcessId: processId,
        module: TypeModule.ANNUAL_REVIEW,
        process: TypeProcess.ANNUAL_REVIEW,
        remark: data.remark,
      });
    }
  };

  const autoSavePayload = useMemo(() => () => {
    const currentRemark = getValues('remark');

    if (!processId) return Promise.resolve(null);

    return Promise.resolve({
      bucketProcessId: processId,
      module: TypeModule.ANNUAL_REVIEW,
      process: TypeProcess.ANNUAL_REVIEW,
      remark: currentRemark,
    });
  }, [processId, getValues]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: activeTab === 0 && !viewOnly,
    payload: autoSavePayload,
    url: 'mip.creditChecking.creditCheckingDebtorRemarkSave',
  });

  return {
    control,
    handleSubmit,
    handleSubmitForm,
    isAutoSaveFetching,
    isSaveLoading,
    setShouldGoNext,
    theme,
    viewOnly,
  };
};

export default useDebtorHook;
