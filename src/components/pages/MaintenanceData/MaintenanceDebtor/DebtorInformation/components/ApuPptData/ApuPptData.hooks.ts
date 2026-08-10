import { useFormContext } from 'react-hook-form';


const useApuPptData = () => {
  const { control } = useFormContext();

  return {
    control,
  };
};

export default useApuPptData;
