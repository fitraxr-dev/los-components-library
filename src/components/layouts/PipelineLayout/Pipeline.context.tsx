'use client';
import { createContext, useContext, useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';


const initialState: PipelineContextState = {
  activeTab: 0,
  existingDebtorId: null,
  isExistingDebtor: false,
  percentage: 0,
};

export const PipelineContext = createContext<PipelineContextType>(undefined);

export const PipelineProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <PipelineContext.Provider value={{ setState, state }}>
      {children}
    </PipelineContext.Provider>
  );
};


export const usePipelineContext = () => {

  const { state, setState } = useContext(PipelineContext);
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

export type PipelineContextState = {
  activeTab: number;
  isExistingDebtor: boolean;
  existingDebtorId: string | null;
  percentage: number;
}

export type PipelineContextType = {
  state: PipelineContextState;
  setState: Dispatch<SetStateAction<PipelineContextState>>;
}
