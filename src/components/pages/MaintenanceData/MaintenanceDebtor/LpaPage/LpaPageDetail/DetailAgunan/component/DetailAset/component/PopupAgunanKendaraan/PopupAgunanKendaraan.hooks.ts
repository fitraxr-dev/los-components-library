import { useEffect } from 'react';

import { useForm } from 'react-hook-form';


const usePopupAgunanKendaraan = (item: any) => {
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

export default usePopupAgunanKendaraan;
