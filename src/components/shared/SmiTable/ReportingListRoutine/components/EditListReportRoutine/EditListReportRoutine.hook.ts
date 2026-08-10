import { useCallback, useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import useGetDetailRoutineReporting from '../../hooks/useGetDetailRoutineReport';
import useSaveRoutineReporting from '../../hooks/useSaveRoutineReporting';
import useSaveRoutineReportingResponseBusiness from '../../hooks/useSaveRoutineReportingResponseBusiness';
import { MODAL_ID } from '../../ReportingListRoutine.constants';

import type { EditListReportRoutineProps } from './EditListReportRoutine.types';
import type { RoutineReportingRequestDto } from '@/services/openapi/mip-service';


const useEditListReportRoutine = (props: EditListReportRoutineProps) => {
  const modalId = MODAL_ID.EDIT_LIST_REPORT;
  const modal = useModal(modalId);
  const [responseContainer, setResponseContainer] = useState(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    businessResponse: false,
  });
  const queryClient = useQueryClient();


  const { data } = useGetDetailRoutineReporting({ id: props.id }, {}, props.module);

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

  const { mutate: saveRoutineReport, isPending: isSaveLoadingRoutine } = useSaveRoutineReporting({
    module: props.module,
    onSuccess: () => {
      showNiceModalV2({ type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const {
    mutate: saveBusinessResponse,
    isPending: isSubmittingBusinessResponse,
  } = useSaveRoutineReportingResponseBusiness({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-detail-routine-reporting-mip', { id: props.id }]});
      showNiceModalV2({ type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const businessResponseData = data?.businessResponse;

  const { handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      deadlineOther: '',
      grade: '',
      isAnnual: false,
      isOther: false,
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
      isOther: false,
      isQuarterly: data?.isQuarterly || false,
      isSemester: data?.isSemester || false,
      remark: data?.remark,
      report: data?.report,
    });
  }, [data]);


  useEffect(() => {
    if (watch('isAnnual') || watch('isQuarterly') || watch('isSemester')) {
      setValue('deadlineOther', '');
    }
  }, [watch('isAnnual'), watch('isQuarterly'), watch('isSemester')]);

  useEffect(() => {
    if (watch('isOther')) {
      setValue('isAnnual', false);
      setValue('isQuarterly', false);
      setValue('isSemester', false);
    }
  }, [watch('isOther')]);

  const handleOnSaveRoutineReport = (data) => {
    const payload: RoutineReportingRequestDto = {
      id: props.id,
      ...data,
    };

    saveRoutineReport(payload);
    closeNiceModal(modalId);
  };


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
      id: Number(props.id),
    });
  };

  return {
    businessResponseData,
    getGradeLevel,
    gradeLevelList,
    handleOnSaveRoutineReport,
    handleSaveBusinessResponse,
    handleSubmit,
    isSaveLoadingRoutine,
    isSubmittingBusinessResponse,
    isWordEditorEmpty,
    modal,
    modalId,
    responseContainer,
    setIsWordEditorEmpty,
    setResponseContainer,
    setValue,
    watch,
  };
};

export default useEditListReportRoutine;
