import { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';


const useOtherCommonInformation = () => {

  const { control } = useFormContext();


  return {
    control,
  };
};

export default useOtherCommonInformation;
