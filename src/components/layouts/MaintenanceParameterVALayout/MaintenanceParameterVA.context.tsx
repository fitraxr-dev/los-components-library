'use client';
import { createContext, useState, type ReactNode } from 'react';


interface MaintenanceParameterVAState {
  currentStep: string;
  // Add more state properties as needed
}

interface MaintenanceParameterVAContextType {
  setState: React.Dispatch<React.SetStateAction<MaintenanceParameterVAState>>;
  state: MaintenanceParameterVAState;
}

const initialState: MaintenanceParameterVAState = {
  currentStep: 'process',
};

export const MaintenanceParameterVAContext = createContext<MaintenanceParameterVAContextType>({
  setState: () => {},
  state: initialState,
});

interface MaintenanceParameterVAProviderProps {
  children: ReactNode;
}

export const MaintenanceParameterVAProvider = ({ children }: MaintenanceParameterVAProviderProps) => {
  const [state, setState] = useState<MaintenanceParameterVAState>(initialState);

  return (
    <MaintenanceParameterVAContext.Provider value={{ setState, state }}>
      {children}
    </MaintenanceParameterVAContext.Provider>
  );
};
