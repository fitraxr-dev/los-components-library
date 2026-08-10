import { createContext, useContext, useState } from 'react';

import { bmppMonitoring } from '@/configs/constants/pathname';


type BmppMonitoringState = {
  activeTab: string | number;
  breadCrumb?: { label: string; url: string }[];
};

type BmppMonitoringContextType = [
  BmppMonitoringState,
  React.Dispatch<React.SetStateAction<BmppMonitoringState>>
];

// SAFE default: undefined
const BmppMonitoringContext = createContext<BmppMonitoringContextType | undefined>(undefined);

const initialState: BmppMonitoringState = {
  activeTab: 'individual',
};

export const BmppMonitoringProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<BmppMonitoringState>(initialState);

  return (
    <BmppMonitoringContext.Provider value={[state, setState]}>
      {children}
    </BmppMonitoringContext.Provider>
  );
};

export const useBmppMonitoringContext = () => {
  const context = useContext(BmppMonitoringContext);
  if (!context) {
    throw new Error('useBmppMonitoringContext must be used within a BmppMonitoringProvider');
  }

  const [state, setState] = context;

  const initiateBreadCrumb = [
    { label: 'Home', url: '/' },
    { label: 'BMPP Monitoring', url: bmppMonitoring.MAIN_PAGE }
  ];

  const { activeTab, breadCrumb } = state;

  const handleSetBreadcrumb = (params: { label: string; url: string }[]) => {
    setState((prev) => ({
      ...prev,
      breadCrumb: [...initiateBreadCrumb, ...params],
    }));
  };

  const setActiveTab = (tab: number | string) => {
    setState((prev) => ({
      ...prev,
      activeTab: tab,
    }));
  };

  return {
    activeTab,
    breadCrumb,
    handleSetBreadcrumb,
    setActiveTab,
    setState,
    state,
  };
};
