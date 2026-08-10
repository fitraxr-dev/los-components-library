import { useFormContext } from 'react-hook-form';


const useBmpkAntOther = () => {
  const { control } = useFormContext();

  return {
    control,
  };
};

export default useBmpkAntOther;
