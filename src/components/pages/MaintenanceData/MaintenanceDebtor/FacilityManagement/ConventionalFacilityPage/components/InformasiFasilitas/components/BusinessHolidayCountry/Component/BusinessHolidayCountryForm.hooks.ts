import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useSaveBusinessHolidayCountry from '../../../../../hooks/BusinessHolidayCountry/useSaveBusinessHoliday';
import { businessHolidayCountrySchema, modal } from '../BusinessHolidayCountry.constant';


const useBusinessHolidayCountryForm = (props: any) => {
  const { control, reset, getValues, formState: { errors, isValid }, watch, setValue } = useForm({
    resolver: yupResolver(businessHolidayCountrySchema),
  });

  const data = props.data;
  const { id } = useParams();
  const { processId } = useIdentity();
  const {
    data: calendarList,
    isSuccess: isCalendarListSuccess,
  } = useGetParameterList('calendar', { label: 'value1', value: 'key' });

  const watchCalenderName = watch('calenderName');

  useEffect(() => {
    if (!data) return;
    if (!isCalendarListSuccess) return;

    const incomingCalenderName = data?.calenderName;

    // Dropdown menyimpan `value` (key). Jika props datangnya `calenderName` (label),
    // maka kita konversi dulu pakai `calendarList` sebelum mereset form.
    const matched = calendarList?.find((item: any) => item.label === incomingCalenderName)
      ?? calendarList?.find((item: any) => item.value === incomingCalenderName);

    reset({
      calenderCode: matched?.value ?? data?.calenderCode ?? '',
      calenderName: matched?.value ?? '',
    });
  }, [calendarList, data, isCalendarListSuccess, reset]);

  useEffect(() => {
    if (!isCalendarListSuccess) return;

    const selected = calendarList?.find((item: any) => item.value === watchCalenderName);
    if (!selected) return;

    setValue('calenderCode', selected.value);
  }, [calendarList, isCalendarListSuccess, setValue, watchCalenderName]);

  const { mutate: saveBusinessHolidayCountry } = useSaveBusinessHolidayCountry({
    onError: (error) => {
      const errorData = error?.message;
      closeNiceModal(modal.MODAL_ADD);
      showNiceModalV2({
        title: errorData,
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(modal.MODAL_ADD);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = () => {
    const values = getValues();
    const selected = isCalendarListSuccess
      ? calendarList?.find((item: any) => item.value === values?.calenderName)
      : null;

    saveBusinessHolidayCountry({
      ...values,

      bucketProcessId: processId as string,
      // Backend mengharapkan `calenderName` berupa label, bukan value (key) dropdown.
      calenderName: selected?.label ?? values?.calenderName,
      facilityId: id as string,
      id: data?.id,
    });
  };
  return {
    calendarList,
    control,
    data,
    errors,
    handleSave,
    isCalendarListSuccess,
    isValid,
  };
};

export default useBusinessHolidayCountryForm;
