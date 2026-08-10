'use client';
import { createContext, useState, type ReactNode } from 'react';


interface ParameterLOVState {
  currentStep: string;
  // Add more state properties as needed
}

interface ParameterLOVContextType {
  setState: React.Dispatch<React.SetStateAction<ParameterLOVState>>;
  state: ParameterLOVState;
}

const initialState: ParameterLOVState = {
  currentStep: 'process',
};

export const ParameterLOVContext = createContext<ParameterLOVContextType>({
  setState: () => {},
  state: initialState,
});

interface ParameterLOVProviderProps {
  children: ReactNode;
}

export const ParameterLOVProvider = ({ children }: ParameterLOVProviderProps) => {
  const [state, setState] = useState<ParameterLOVState>(initialState);

  return (
    <ParameterLOVContext.Provider value={{ setState, state }}>
      {children}
    </ParameterLOVContext.Provider>
  );
};
