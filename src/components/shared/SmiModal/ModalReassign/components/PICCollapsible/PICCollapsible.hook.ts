import { useEffect, useState } from 'react';


import type { PICCollapsibleProps } from './PICCollapsible.types';


const usePICCollapsible = (props: PICCollapsibleProps) => {
  const { picData, useFormValues, divisionId, isMonitoring, picList } = props;
  const { setValue } = useFormValues;
  const [isReAssignTo, setIsReAssignTo] = useState(false);

  useEffect(() => {
    if (!isReAssignTo) {
      setValue(`picList.${picData.index}.reAssignTo`, {});
      setValue(`picList.${picData.index}.reAssignTo.isActive`, false);
    } else {
      setValue(`picList.${picData.index}.reAssignTo.isActive`, true);
    }

  }, [isReAssignTo]);


  const isSwitchDisabled = () => {
    if (!isMonitoring) return false;

    return false;
  };

  const getSectionTitle = () => {
    if (picList && picList.length === 1) {
      return 'PIC';
    }
    return `PIC ${picData.index + 1}`;
  };


  return {
    divisionId,
    getSectionTitle,
    isReAssignTo,
    isSwitchDisabled,
    setIsReAssignTo,
  };
};

export default usePICCollapsible;
