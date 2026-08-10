import { useEffect } from 'react';

import { useForm } from 'react-hook-form';


const usePopupAgunanTanah = (item: any) => {
  const { control, setValue, watch, reset } = useForm();
  useEffect(() => {
    reset(item);
  }, [item]);
  return {
    control,
    setValue,
    watch,
  };
};

export default usePopupAgunanTanah;
