'use client';

import { useState } from 'react';

import { tab } from './List.constants';


const useList = () => {
  const [activeTab, setActiveTab] = useState<typeof tab[keyof typeof tab]>(tab.LIST_DATA);

  const handleChangeTab = (value: string) => {
    setActiveTab(value as typeof tab[keyof typeof tab]);
  };

  return {
    activeTab,
    handleChangeTab,
  };
};

export default useList;
