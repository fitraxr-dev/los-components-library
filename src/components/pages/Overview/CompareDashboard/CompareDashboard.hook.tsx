import { useState } from 'react';

import { tab } from './CompareDashboard.constants';


const useCompareDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>(tab.SUCCESS_RATE);

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
  };

  return {
    activeTab,
    handleChangeTab,
  };
};

export default useCompareDashboard;
