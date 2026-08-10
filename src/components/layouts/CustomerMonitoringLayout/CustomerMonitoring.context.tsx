'use client';
import { createContext, useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';


const initialState: CustomerMonitoringContextState = {
  // Add state properties as needed
};

export const CustomerMonitoringContext = createContext<CustomerMonitoringContextType | undefined>(undefined);

export const CustomerMonitoringProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<CustomerMonitoringContextState>(initialState);

  return (
    <CustomerMonitoringContext.Provider value={{ setState, state }}>
      {children}
    </CustomerMonitoringContext.Provider>
  );
};

export type CustomerMonitoringContextState = {
  // Add state properties as needed in the future
}

export type CustomerMonitoringContextType = {
  state: CustomerMonitoringContextState;
  setState: Dispatch<SetStateAction<CustomerMonitoringContextState>>;
}
