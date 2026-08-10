'use client';

import { useState } from 'react';

import { tab } from './List.constants';


const useList = () => {
  const [activeTab, setActiveTab] = useState(tab.LIST_DATA);

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
  };

  return {
    activeTab,
    handleChangeTab,
  };
};

export default useList;
