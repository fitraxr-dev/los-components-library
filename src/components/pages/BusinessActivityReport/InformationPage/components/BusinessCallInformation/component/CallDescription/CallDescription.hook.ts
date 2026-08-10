import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';

import useGetParameterList from '@/hooks/services/useGetParameterList';

import useBarInformation from '@/components/pages/BusinessActivityReport/InformationPage/Information.hook';


const useCallDescription = () => {

  const { isNew, canCreateBAR, canEditBAR, isBarCreation } = useBarInformation();

  const theme = useTheme();

  const { data: mediaDropdownList } = useGetParameterList('barMedia');
  const { data: businessCallDropdownList } = useGetParameterList('barBusinessCall');
  const { data: summaryAlertDropdownList } = useGetParameterList('barSummaryAlert');

  const { control, setValue, formState: { errors }, watch } = useFormContext();
  const watchFields = watch();

  const maxDate = dayjs().toString();

  return {
    businessCallDropdownList,
    canCreateBAR,
    canEditBAR,
    control,
    errors,
    isBarCreation,
    isNew,
    maxDate,
    mediaDropdownList,
    setValue,
    summaryAlertDropdownList,
    theme,
    watchFields,
  };
};


export default useCallDescription;
