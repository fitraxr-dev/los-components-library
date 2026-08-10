'use client';

import { useEffect } from 'react';


import { useReportContext } from '@/components/layouts/ReportLayout/Report.context';


import { tab } from './List.constants';


const useList = () => {
  const [state, setState] = useReportContext();

  const activeTab = state.activeTab;

  const handleChangeTab = (val: string) => {
    setState((prev) => ({ ...prev, activeTab: val }));
  };

  return {
    activeTab,
    handleChangeTab,
  };
};

export default useList;
