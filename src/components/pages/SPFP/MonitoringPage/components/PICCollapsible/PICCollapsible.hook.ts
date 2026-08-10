import { useEffect, useState } from 'react';

import type { PICCollapsibleProps } from './PICCollapsible.types';


const usePICCollapsible = (props: PICCollapsibleProps) => {
  const { picData, useFormValues } = props;
  const { setValue } = useFormValues;
  const [isReAssignTo, setIsReAssignTo] = useState(false);
  useEffect(() => {
    if (!isReAssignTo) {
      setValue(`picList.${picData.index}.reAssignTo`, {});
    }

  }, [isReAssignTo]);

  return {
    isReAssignTo,
    setIsReAssignTo,
  };
};

export default usePICCollapsible;
