import { useEffect, useState, useCallback, useMemo } from 'react';

import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';


const useCreditorSection = (props) => {
  const { callback = () => {}, index, data = {} } = props;

  const [state, setState] = useState(data);

  useEffect(() => {
    setState(data);
  }, [data]);

  const creditorTypeString = state?.creditorType || '';
  const primaryCreditorType = creditorTypeString.split('|')[0];

  const { data: creditorList } = useGetParameterList('syndication', { module: 'value2', value1: 'value1', value2: 'key' });

  const { data: creditorListByModule } = useGetParameterList(creditorList?.find((val) => {
    return (val.value2 === primaryCreditorType);
  })?.module, { id: 'key', label: 'value1' });

  const dataType = useMemo(() =>
    creditorList?.map((val) => ({ label: val.value1, value: val.value2 })) || [],
  [creditorList]
  );

  const handleStateChange = useCallback((newState) => {
    const updatedState = {
      ...state,
      ...newState,
    };
    setState(updatedState);
    callback(index, updatedState);
  }, [callback, index, state]);

  return {
    creditorListByModule,
    dataType,
    primaryCreditorType,
    setState: handleStateChange,
    state,
  };
};

export default useCreditorSection;
