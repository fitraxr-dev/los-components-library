import { useEffect } from 'react';

/**
 * Format a numeric value to always have exactly 6 decimal places.
 * e.g. 1 → "1.000000", 1.12 → "1.120000", 1.1234567 → "1.123456"
 */
export const formatToSixDecimal = (value: string | number): string => {
  const num = parseFloat(String(value));
  if (isNaN(num)) return '0.000000';
  return num.toFixed(6);
};

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useSaveMultirate from '../../../../../hooks/Multirate/useSaveMultirate';
import { modal, multiRateSchema } from '../DetailMultiRate.constant';


const useDetailMultiRateForm = (props: any) => {
  const theme = useTheme();
  const { id } = useParams();
  const { processId } = useIdentity();
  const { control, watch, reset, getValues, setValue, formState: { errors, isValid } } = useForm({
    defaultValues: {
      baseRate: 0,
      margin: 0,
      period: 0,
      totalEffectiveRate: 0,
    },
    resolver: yupResolver(multiRateSchema),
  });

  const data = props.data;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  useEffect(() => {
    const total = Number(watch('baseRate') || 0) + Number(watch('margin') || 0);
    setValue('totalEffectiveRate', formatToSixDecimal(total));
  }, [watch('baseRate'), watch('margin')]);

  const { mutate: saveDetailMultiRate } = useSaveMultirate({
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
    saveDetailMultiRate({
      bucketProcessId: processId as string,
      facilityId: id as string,
      ...getValues(),
    });
  };

  return {
    control,
    data,
    errors,
    handleSave,
    isValid,
    theme,
    watch,
  };
};

export default useDetailMultiRateForm;
