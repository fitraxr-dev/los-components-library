import { useState } from 'react';

import { tab } from './Conclusion.constants';


export const useConclusion = () => {
  const [activeTab, setActiveTab] = useState(tab.SUMMARY);

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

  return {
    activeTab,
    handleChangeTab,
  };
};
