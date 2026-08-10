'use client';
import { createContext, useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';


const initialState: ProcessMonitoringContextState = {
  // Add state properties as needed
};

export const ProcessMonitoringContext = createContext<ProcessMonitoringContextType | undefined>(undefined);

export const ProcessMonitoringProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ProcessMonitoringContextState>(initialState);

  return (
    <ProcessMonitoringContext.Provider value={{ setState, state }}>
      {children}
    </ProcessMonitoringContext.Provider>
  );
};

export type ProcessMonitoringContextState = {
  // Add state properties as needed in the future
}

export type ProcessMonitoringContextType = {
  state: ProcessMonitoringContextState;
  setState: Dispatch<SetStateAction<ProcessMonitoringContextState>>;
}
