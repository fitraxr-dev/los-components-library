'use client';

import { useEffect, useMemo } from 'react';

import { useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';


const useDescriptionForm = (index: number) => {
  const { control, watch, setValue, getValues, resetField, register } = useFormContext();
  const theme = useTheme();

  const { data: moduleListGrade } = useGetParameterList(Modules.GRADE_CAP, {
    gradeDescription: 'value2',
    label: 'value1',
    value: 'key',
  });

  useEffect(() => {
    if (watch(`descriptionList.${index}`) === undefined) {
      setValue(`descriptionList.${index}`, {
        actionDescription: '',
        businessResponse: null,
        capId: '',
        commentsActionDescription: [],
        commentsParameter: [],
        commentsTargetFullfillment: [],
        grade: '1',
        parameter: '',
        targetFullfillment: '',
      });
    }
  }, [watch(`descriptionList.${index}`), index]);

  const gradeDescription = useMemo(() => {
    const gradeValue = getValues(`descriptionList.${index}.grade`);

    if (!moduleListGrade || gradeValue === undefined || gradeValue === null || gradeValue === '') {
      return '';
    }

    const foundGrade = moduleListGrade.find((item: any) => {
      return item.value?.toString() === gradeValue?.toString();
    });
    if (foundGrade) {
      return foundGrade.gradeDescription || '';
    }

    return '';
  }, [getValues(`descriptionList.${index}.grade`), moduleListGrade]);

  useEffect(() => {
    resetField('actionDescription');
    resetField('grade');
    resetField('parameter');
    resetField('targetFullfillment');
  }, [index]);

  return {
    control,
    getValues,
    gradeDescription,
    moduleListGrade,
    register,
    setValue,
    theme,
    watch,
  };
};

export default useDescriptionForm;
