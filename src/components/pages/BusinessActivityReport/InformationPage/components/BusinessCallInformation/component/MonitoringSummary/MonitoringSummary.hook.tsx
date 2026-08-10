import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import useGetParameterList from '@/hooks/services/useGetParameterList';

import useBarInformation from '@/components/pages/BusinessActivityReport/InformationPage/Information.hook';


const useMonitoringSummary = () => {
  const theme = useTheme();
  const { canCreateBAR, canEditBAR, isBarCreation } = useBarInformation();
  const { watch, register, setValue, formState: { errors } } = useFormContext();


  const { data: monitoringList } = useGetParameterList('barMonitoring');
  const watchFields = watch();

  const handleCheck = (val: string) => {
    let res = [];

    if (watchFields.checklist.includes(val)) {
      res = watchFields.checklist.filter((item) => item !== val);
    } else {
      res = [...watchFields.checklist, val];
    }

    if (val === 'OTHER') setValue('other', null);

    setValue('checklist', res);
  };

  const handleCheckOther = (val: string) => {
    setValue('other', val);
  };


  return {
    canCreateBAR,
    canEditBAR,
    errors,
    handleCheck,
    handleCheckOther,
    isBarCreation,
    monitoringList,
    register,
    theme,
    watchFields,
  };
};

export default useMonitoringSummary;
