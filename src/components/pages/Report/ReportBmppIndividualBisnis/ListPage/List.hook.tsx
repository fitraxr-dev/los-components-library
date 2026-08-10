'use client';

import { useState } from 'react';

import useGetDataReportBmppIndividualBisnis from '@/hooks/services/report/report-bmpp-individual-bisnis/useGetDataReportBmppIndividualBisnis';
import useGetHistoryBmppIndividualBisnis from '@/hooks/services/report/report-bmpp-individual-bisnis/useGetHistoryBmppIndividualBisnis';


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
