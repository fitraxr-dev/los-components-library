'use client';
import { createContext, useState, type ReactNode } from 'react';


interface MaintenanceParameterAPUPPTState {
  currentStep: string;
  // Add more state properties as needed
}

interface MaintenanceParameterAPUPPTContextType {
  setState: React.Dispatch<React.SetStateAction<MaintenanceParameterAPUPPTState>>;
  state: MaintenanceParameterAPUPPTState;
}

const initialState: MaintenanceParameterAPUPPTState = {
  currentStep: 'process',
};

export const MaintenanceParameterAPUPPTContext = createContext<MaintenanceParameterAPUPPTContextType>({
  setState: () => {},
  state: initialState,
});

interface MaintenanceParameterAPUPPTProviderProps {
  children: ReactNode;
}

export const MaintenanceParameterAPUPPTProvider = ({ children }: MaintenanceParameterAPUPPTProviderProps) => {
  const [state, setState] = useState<MaintenanceParameterAPUPPTState>(initialState);

  return (
    <MaintenanceParameterAPUPPTContext.Provider value={{ setState, state }}>
      {children}
    </MaintenanceParameterAPUPPTContext.Provider>
  );
};
