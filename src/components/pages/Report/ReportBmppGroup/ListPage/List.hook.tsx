'use client';

import { useState } from 'react';


const useList = () => {
  const [activeTab, setActiveTab] = useState('list-data');

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
  };

  return {
    activeTab,
    handleChangeTab,
  };
};

export default useList;
