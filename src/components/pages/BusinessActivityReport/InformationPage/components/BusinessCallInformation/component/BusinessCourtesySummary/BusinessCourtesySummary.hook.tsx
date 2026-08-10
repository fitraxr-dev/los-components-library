import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';


import useGetParameterList from '@/hooks/services/useGetParameterList';

import useBarInformation from '@/components/pages/BusinessActivityReport/InformationPage/Information.hook';


const useBusinessCourtesySummary = () => {
  const theme = useTheme();
  const { canCreateBAR, canEditBAR, isBarCreation } = useBarInformation();
  const { watch, register, setValue } = useFormContext();

  const { data: businessCourtesyList } = useGetParameterList('barBusinessCourtesy');
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
    businessCourtesyList,
    canCreateBAR,
    canEditBAR,
    handleCheck,
    handleCheckOther,
    isBarCreation,
    register,
    setValue,
    theme,
    watchFields,
  };
};

export default useBusinessCourtesySummary;
