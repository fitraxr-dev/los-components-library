import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useSaveFacilityFee from '../../../../../hooks/FacilityFee/useSaveFacilityFee';
import { modal, facilityFeeSchema } from '../FacilityFee.constant';


const useFacilityFeeForm = (props: any) => {
  const { control, watch, reset, getValues, setValue, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(facilityFeeSchema),
  });
  const theme = useTheme();
  const { id } = useParams();
  const { processId } = useIdentity();

  const { data: feeTypeList } = useGetParameterList('feeType', { basisType: 'value5', inputType: 'value4', label: 'value1', value: 'key' });

  const data = props.data;
  const inputType = watch('inputType');

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  useEffect(() => {
    if (inputType === 'amount') {
      setValue('percentage', null as any);
    } else if (inputType === 'percentage') {
      setValue('amount', null as any);
    }
  }, [inputType]);


  const { mutate: saveFacilityFee } = useSaveFacilityFee({
    onError: (error) => {
      closeNiceModal(modal.MODAL_ADD);
      showNiceModalV2({
        title: error?.message,
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
    saveFacilityFee({
      ...getValues(),
      bucketProcessId: processId as string,
      facilityId: id as string,
    });
  };
  return {
    control,
    errors,
    feeTypeList,
    handleSave,
    inputType,
    isValid,
    setValue,
    theme,
    watch,
  };
};

export default useFacilityFeeForm;
