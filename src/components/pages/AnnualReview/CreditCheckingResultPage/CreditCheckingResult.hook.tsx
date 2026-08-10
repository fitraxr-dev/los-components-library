import { useContext } from 'react';

import { CreditCheckingContext } from './CreditCheckingResult.context';


const useManagementShareholderHook = () => {
  const { activeTab, setActiveTab } = useContext(CreditCheckingContext);

  return {
    activeTab,
    setActiveTab,
  };
};
export default useManagementShareholderHook;
