import { useForm } from 'react-hook-form';


const useDetailAset = () => {
  const { control, setValue, watch } = useForm();

  return {
    control,
    setValue,
    watch,
  };
};

export default useDetailAset;
