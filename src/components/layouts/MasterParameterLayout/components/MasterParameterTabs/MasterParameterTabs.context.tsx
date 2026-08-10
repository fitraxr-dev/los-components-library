import * as React from 'react';

import type { TabValue } from './MasterParameterTabs.types';


type Ctx = { activeTab: TabValue; setActiveTab: (v: TabValue) => void };

const MasterParameterTabsContext = React.createContext<Ctx | null>(null);
export const useMasterParameterTabs = () => {
  const ctx = React.useContext(MasterParameterTabsContext);
  if (!ctx) throw new Error('useMasterParameterTabs must be used inside <MasterParameterTabsProvider>');

  return ctx;
};

export const MasterParameterTabsProvider = ({ value, children }: { value: Ctx; children: React.ReactNode }) => {
  return (
    <MasterParameterTabsContext.Provider value={value}>
      {children}
    </MasterParameterTabsContext.Provider>
  );
};
