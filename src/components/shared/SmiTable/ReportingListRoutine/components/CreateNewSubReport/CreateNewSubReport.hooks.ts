import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';


import useGetDetailSubRoutineReport from '../../hooks/useGetDetailSubRoutineReport';
import useSaveRoutineSubReporting from '../../hooks/useSaveRoutineSubReporting';
import { MODAL_ID } from '../../ReportingListRoutine.constants';

import type { CreateNewSubReportProps } from './CreateNewSubReport.types';


const useCreateNewSubReport = (props: CreateNewSubReportProps) => {
  console.log('props', props);
  const { data, isLoading } = useGetDetailSubRoutineReport({ id: props.id }, {}, props.module);

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      id: 0,
      parentId: 0,
      report: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      id: data?.id || null,
      parentId: data?.parentId || null,
      report: data?.report,
    });
  }, [data]);

  const { mutate: saveRoutineSubReporting, isPending: isSaveLoadingSubReporting } = useSaveRoutineSubReporting({
    module: props.module,
    onSuccess: () => {
      showNiceModalV2({ type: 'success' });
    },
  });

  const handleSaveRoutineSubReporting = (data) => {
    const payload = {
      ...data,
      id: props.id,
      parentId: props.parentId,
    };

    saveRoutineSubReporting(payload);
    closeNiceModal(MODAL_ID.CREATE_SUB_REPORT);
  };

  return {
    control,
    data,
    handleSaveRoutineSubReporting,
    handleSubmit,
    isLoading,
    isSaveLoadingSubReporting,
    reset,
    setValue,
    watch,
  };
};

export default useCreateNewSubReport;
