'use client';

import { useCallback, useContext, useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { DirtyContext } from '@/contexts/DirtyContext';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailRoutineReporting from '@/hooks/services/mip/routine-reporting/useGetDetailRoutineReport';
import useSaveRoutineReportingResponseBusiness from '@/hooks/services/mip/routine-reporting/useSaveRoutineReportingResponseBusiness';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';


const useEditListReportRoutine = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const viewOnly = searchParams.get('viewOnly') === 'true';
  const theme = useTheme();
  const router = useCustomRouter();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [responseContainer, setResponseContainer] = useState(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    businessResponse: false,
  });
  const queryClient = useQueryClient();


  const { data } = useGetDetailRoutineReporting({ id: Number(id) });

  useEffect(() => {
    if (responseContainer !== null || responseContainer !== undefined) {
      setIsWordEditorEmpty({
        businessResponse: !data?.businessResponse ? true : false,
      });
    } else {
      setIsWordEditorEmpty({
        businessResponse: true,
      });
    }
  }, [responseContainer]);

  const {
    mutate: saveBusinessResponse,
    isPending: isSubmittingBusinessResponse,
  } = useSaveRoutineReportingResponseBusiness({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-detail-routine-reporting-mip', { id: Number(id) }]});
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose: () => {
          router.back();
        },
        title: 'Data berhasil di disimpan',
        type: 'success',
      });
    },
  });

  const businessResponseData = data?.businessResponse;

  const { handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      deadlineOther: '',
      grade: '',
      isAnnual: false,
      isQuarterly: false,
      isSemester: false,
      remark: '',
      report: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      deadlineOther: data?.deadlineOther,
      grade: data?.grade,
      isAnnual: data?.isAnnual || false,
      isQuarterly: data?.isQuarterly || false,
      isSemester: data?.isSemester || false,
      remark: data?.remark,
      report: data?.report,
    });
  }, [data]);

  useEffect(() => {
    if (watch('isAnnual') || watch('isQuarterly') || watch('isSemester')) {
      setValue('deadlineOther', null);
    }
  }, [watch('isAnnual'), watch('isQuarterly'), watch('isSemester')]);


  const { data: gradeLevelList } = useGetParameterList(Modules.GRADE_REPORT, {
    label: 'value1',
    text: 'value2',
    value: 'key',
  });

  const getGradeLevel = useCallback(() => {
    const gradeLevel = gradeLevelList?.find((item: { value: string }) => item.value === watch('grade'));

    if (!gradeLevel) return { key: '', text: '', value: '' };

    return gradeLevel;
  }, [watch('grade')]);

  const handleSaveBusinessResponse = async () => {
    const businessResponse = await convertToDocx(responseContainer);

    saveBusinessResponse({
      businessResponse: businessResponse,
      id: Number(id),
    });
  };

  const handleCancel = () => {
    router.back();
  };


  return {
    businessResponseData,
    getGradeLevel,
    gradeLevelList,
    handleCancel,
    handleSaveBusinessResponse,
    handleSubmit,
    isSubmittingBusinessResponse,
    isWordEditorEmpty,
    responseContainer,
    router,
    setIsWordEditorEmpty,
    setResponseContainer,
    setValue,
    theme,
    viewOnly,
    watch,
  };
};

export default useEditListReportRoutine;
