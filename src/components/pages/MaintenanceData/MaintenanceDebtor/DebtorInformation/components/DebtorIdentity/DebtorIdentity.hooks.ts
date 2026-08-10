import { useFormContext } from 'react-hook-form';


const useDebtorIdentity = () => {
  const { control, watch } = useFormContext();

  return {
    control,
    watch,
  };
};

export default useDebtorIdentity;
