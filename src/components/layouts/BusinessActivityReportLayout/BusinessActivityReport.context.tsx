'use client';
import { createContext, useContext, useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';


const initialState: BARContextState = {
  activeTab: 0,
  existingDebtorId: null,
  isExistingDebtor: false,
  percentage: 0,
};

export const BusinessActivityReport = createContext<BARContextType>(undefined);

export const BusinessActivityReportProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <BusinessActivityReport.Provider value={{ setState, state }}>
      {children}
    </BusinessActivityReport.Provider>
  );
};

export const useBusinessActivityReport = () => {

  const { state, setState } = useContext(BusinessActivityReport);
  const { activeTab } = state;
  function setActiveTab(tab: number) {
    const newState = structuredClone(state);
    newState.activeTab = tab;
    setState(newState);
  }

  const renderDetailLayout = false;

  return {
    activeTab,
    renderDetailLayout,
    setActiveTab,
  };
};

export type BARContextState = {
  activeTab: number;
  isExistingDebtor: boolean;
  existingDebtorId: string | null;
  percentage: number;
}

export type BARContextType = {
  state: BARContextState;
  setState: Dispatch<SetStateAction<BARContextState>>;
}
