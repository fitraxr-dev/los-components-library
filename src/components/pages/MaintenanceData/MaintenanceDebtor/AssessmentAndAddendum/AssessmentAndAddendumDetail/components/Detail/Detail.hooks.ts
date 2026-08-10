import { useForm } from 'react-hook-form';


const useDetail = () => {
  const { control } = useForm();

  return {
    control,
  };
};

export default useDetail;
