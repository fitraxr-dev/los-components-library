'use client';
import { createContext, useState, type ReactNode } from 'react';


interface MaintenanceParameterBarState {
  currentStep: string;
  breadCrumb: Array<{ label: string; url: string }>;
  // Add more state properties as needed
}

interface MaintenanceParameterBarContextType {
  setState: React.Dispatch<React.SetStateAction<MaintenanceParameterBarState>>;
  state: MaintenanceParameterBarState;
}

const initialState: MaintenanceParameterBarState = {
  breadCrumb: [
    { label: 'Home', url: '/' },
    { label: 'Parameter Mapping Bar', url: '/master-parameter/parameter-bar' }
  ],
  currentStep: 'process',
};

export const MaintenanceParameterBarContext = createContext<MaintenanceParameterBarContextType>({
  setState: () => {},
  state: initialState,
});

interface MaintenanceParameterBarProviderProps {
  children: ReactNode;
}

export const MaintenanceParameterBarProvider = ({ children }: MaintenanceParameterBarProviderProps) => {
  const [state, setState] = useState<MaintenanceParameterBarState>(initialState);

  return (
    <MaintenanceParameterBarContext.Provider value={{ setState, state }}>
      {children}
    </MaintenanceParameterBarContext.Provider>
  );
};
