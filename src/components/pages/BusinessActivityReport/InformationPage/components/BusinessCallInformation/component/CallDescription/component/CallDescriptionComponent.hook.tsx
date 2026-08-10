import { useMemo } from 'react';

import { useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetParameterListRaw from '@/hooks/services/useGetParameterListRaw';

import useBarInformation from '@/components/pages/BusinessActivityReport/InformationPage/Information.hook';


const useCallDescriptionComponent = () => {
  const theme = useTheme();
  const { canCreateBAR, canEditBAR, isBarCreation } = useBarInformation();
  const { watch, register, setValue } = useFormContext();
  const { data: businessCallDropdownList } = useGetParameterListRaw('barBusinessCall');

  const watchFields = watch();

  const callDescription = useMemo(
    () => businessCallDropdownList?.filter((item) => item.key === watchFields?.businessCallType),
    [watchFields?.businessCallType, businessCallDropdownList]
  );

  const callDescriptionValue = callDescription.length > 0 && (callDescription[0].value2 !== '' ? callDescription[0].value2 : callDescription[0].key);
  const callDescriptionTitle = callDescription.length > 0 && callDescription[0].value1;

  const { data: checkedList } = useGetParameterList(callDescriptionValue);

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
    callDescriptionTitle,
    canCreateBAR,
    canEditBAR,
    checkedList,
    handleCheck,
    handleCheckOther,
    isBarCreation,
    register,
    setValue,
    theme,
    watchFields,
  };
};
export default useCallDescriptionComponent;
