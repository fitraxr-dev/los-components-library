'use client';

import { useCallback, useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useGetDetailRoutineReporting from '@/components/shared/SmiTable/ReportingListRoutine/hooks/useGetDetailRoutineReport';
import useGetListReport from '@/components/shared/SmiTable/ReportingListRoutine/hooks/useGetListReport';
import useSaveRoutineReporting from '@/components/shared/SmiTable/ReportingListRoutine/hooks/useSaveRoutineReporting';
import useSaveRoutineReportingResponseBusiness from '@/components/shared/SmiTable/ReportingListRoutine/hooks/useSaveRoutineReportingResponseBusiness';

import { MODAL_ID } from '../../ReportingListRoutine.constants';

import type { EditListReportRoutineProps } from './EditListReportRoutine.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { RoutineReportingRequestDto } from '@/services/openapi/mip-service';


const useEditListReportRoutine = (props: EditListReportRoutineProps) => {
  const modalId = MODAL_ID.EDIT_LIST_REPORT;
  const modal = useModal(modalId);
  const [responseContainer, setResponseContainer] = useState(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    businessResponse: false,
  });
  const [subReports, setSubReports] = useState<string[]>(['']);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data } = useGetDetailRoutineReporting({ id: props.id }, {}, props.module);
  const [selectedTask, setSelectedTask] = useState([]);
  const { processId } = useIdentity();

  const { data: listReport, isLoading } = useGetListReport({
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
  });

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
    onError: (error) => {
      const errorData = error?.response?.data || error;
      const errorDetail = errorData?.errorDetail || errorData?.errorDesc || error?.message || 'Data gagal disimpan';
      showNiceModalV2({ title: errorDetail, type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const { mutate: saveBusinessResponse, isPending: isSubmittingBusinessResponse } =
    useSaveRoutineReportingResponseBusiness({
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
      subReports: [''],
    },
    mode: 'onChange',
  });

  const processList = listReport?.contents?.map((process) => ({
    ...process,
    report: process.report ?? '-',
  }));

  const processPage = listReport?.page;

  const hasEmptySubReports = subReports.some((subReport) => subReport.trim() === '');
  const isMainReportEmpty = watch('report')?.trim() === '';

  useEffect(() => {
    if (data) {
      let formattedSubReports;
      if (data?.subReports && data.subReports.length > 0) {
        formattedSubReports = data.subReports.map((sub: any) => sub.report || '');
      } else {
        formattedSubReports = [''];
      }

      reset({
        deadlineOther: data?.deadlineOther || '',
        grade: data?.grade || '',
        isAnnual: data?.isAnnual || false,
        isOther: data?.isOther || false,
        isQuarterly: data?.isQuarterly || false,
        isSemester: data?.isSemester || false,
        remark: data?.remark || '',
        report: data?.report || '',
        subReports: formattedSubReports,
      });

      setSubReports(formattedSubReports);
      if (props.title === 'Edit') {
        setSelectedTask([
          {
            id: data.id,
            report: data.report,
          },
        ]);
      }
    }
  }, [data, reset, props.title]);

  const hasDeadlineSelected = watch('isAnnual') || watch('isQuarterly') || watch('isSemester') || watch('isOther');
  const isOtherDeadlineEmpty = watch('isOther') && (!watch('deadlineOther') || watch('deadlineOther').trim() === '');

  useEffect(() => {
    if (watch('isAnnual') || watch('isQuarterly') || watch('isSemester')) {
      setValue('deadlineOther', '');
    }
  }, [watch('isAnnual'), watch('isQuarterly'), watch('isSemester')]);

  useEffect(() => {
    if (modal?.visible) {
      queryClient.invalidateQueries({ queryKey: ['get-detail-routine-reporting-mip', { id: props.id }]});
    }
  }, [modal?.visible, props.id, queryClient]);

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
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      subReports: subReports.map((report) => ({
        businessResponse: null,
        report,
      })),
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

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => {
        return selectedTask.some((item) => item.id === data.id);
      },
      key: 'radio',
      onSelectChange: (data) => {
        if (selectedTask.some((item) => item.id === data.id)) {
          setSelectedTask([]);
          setValue('report', '');
          setValue('remark', '');
          setSubReports(['']);
        } else {
          setSelectedTask([
            {
              id: data.id,
              report: data.report,
            },
          ]);
          setValue('report', data.report);
          setValue('remark', data.remark || '');
          if (data.subReports && data.subReports.length > 0) {
            const subReportsList = data.subReports.map((sub: any) => sub.report || '');
            setSubReports(subReportsList);
            setValue('subReports', subReportsList);
          } else {
            setSubReports(['']);
            setValue('subReports', ['']);
          }
        }
      },
      sx: { minWidth: '4vw' },
      type: 'radio',
    },
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'report',
      label: 'Laporan',
    },
  ];

  const handleSaveBusinessResponse = async () => {
    const businessResponse = await convertToDocx(responseContainer);

    saveBusinessResponse({
      businessResponse: businessResponse,
      id: Number(props.id),
    });
  };

  const handleAddSubReport = useCallback(() => {
    const newSubReports = [...subReports, ''];
    setSubReports(newSubReports);
    setValue('subReports', newSubReports);
  }, [subReports, setValue]);

  const handleSubReportChange = useCallback(
    (index: number, value: string) => {
      const newSubReports = [...subReports];
      newSubReports[index] = value;
      setSubReports(newSubReports);
      setValue('subReports', newSubReports);
    },
    [subReports, setValue],
  );

  const handleDeleteSubReport = useCallback(
    (index: number) => {
      if (subReports.length > 1) {
        const newSubReports = subReports.filter((_, idx) => idx !== index);
        setSubReports(newSubReports);
        setValue('subReports', newSubReports);
      }
    },
    [subReports, setValue],
  );

  return {
    businessResponseData,
    getGradeLevel,
    gradeLevelList,
    handleAddSubReport,
    handleDeleteSubReport,
    handleOnSaveRoutineReport,
    handleSaveBusinessResponse,
    handleSubReportChange,
    handleSubmit,
    hasDeadlineSelected,
    hasEmptySubReports,
    isLoading,
    isMainReportEmpty,
    isOtherDeadlineEmpty,
    isSaveLoadingRoutine,
    isSubmittingBusinessResponse,
    isWordEditorEmpty,
    listReport,
    modal,
    modalId,
    page,
    processList,
    processPage,
    responseContainer,
    selectedTask,
    setIsWordEditorEmpty,
    setPage,
    setPageSize,
    setResponseContainer,
    setSelectedTask,
    setValue,
    subReports,
    tableHeader,
    watch,
  };
};

export default useEditListReportRoutine;
