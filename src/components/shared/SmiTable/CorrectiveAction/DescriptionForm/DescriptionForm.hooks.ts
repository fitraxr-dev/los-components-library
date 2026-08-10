import { useEffect, useMemo, useState } from 'react';

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
        grade: null,
        parameter: '',
        targetFullfillment: '',
      });
    }

  }, [watch(`descriptionList.${index}`), index]);

  const gradeDescription = useMemo(() => {
    const gradeValue = getValues(`descriptionList.${index}.grade`);
    const findIndex = moduleListGrade.findIndex((grade: { value: any }) => grade.value === gradeValue);
    return moduleListGrade[findIndex]?.gradeDescription;
  }, [watch(`descriptionList.${index}.grade`)]);

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
    theme,
    watch,
  };
};

export default useDescriptionForm;
