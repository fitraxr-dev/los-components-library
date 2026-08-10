import React, { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import useGetParameterList from '@/hooks/services/useGetParameterList';

import useBarInformation from '@/components/pages/BusinessActivityReport/InformationPage/Information.hook';


const useMaintenanceSummary = () => {
  const theme = useTheme();
  const { canCreateBAR, canEditBAR, isBarCreation } = useBarInformation();
  const { watch, register, setValue } = useFormContext();

  const { data: maintenanceSummaryList } = useGetParameterList('barMaintenance');
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
    handleCheck,
    handleCheckOther,
    isBarCreation,
    maintenanceSummaryList,
    register,
    theme,
    watchFields,
  };
};

export default useMaintenanceSummary;
