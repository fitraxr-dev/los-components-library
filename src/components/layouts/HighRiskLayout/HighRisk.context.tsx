'use client';
import { createContext, useContext, useState } from 'react';

import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';

import type { Dispatch, SetStateAction } from 'react';


export const HighRiskContext = createContext(undefined);

const initialState = {
  activeTab: 0,
};


export const HighRiskProvider = ({ children }) => {
  const [highRiskState, setHighRiskState] = useState(initialState);

  return (
    <HighRiskContext.Provider value={[highRiskState, setHighRiskState]}>
      {children}
    </HighRiskContext.Provider>
  );
};

export const useHighRiskContext = () => {
  const [appState] = useApp();
  const [state, setState] = useContext(HighRiskContext);
  const { activeTab } = state;
  const stepper = appState.stepper;
  const pathname = usePathname();

  const isStaff = appState.currentRole.includes(roles.RM);
  const isTL = appState.currentRole.includes(roles.TL);
  const isKadiv = appState.currentRole.includes(roles.KADIV);

  const currentListPage = pathname.split('/').splice(0, 4).join('/');

  const goToNextStep = useGoToNextStep();
  const actionButtons: Object = stepper.steps.find((step) => step.urlPath === getLastPath(pathname))?.action;

  const setActiveTab = (tab: number) => {
    const newState = structuredClone(state);
    newState.activeTab = tab;
    setState(newState);
  };

  return {
    actionButtons,
    activeTab,
    currentListPage,
    goToNextStep,
    isKadiv,
    isStaff,
    isTL,
    setActiveTab,
    setState,
    state,
    stepper,
  };
};

export type HighRiskContextState = {
  isExistingDebtor: boolean;
  existingDebtorId: string | null;
  percentage: number;
}

export type HighRiskContextType = {
  state: HighRiskContextState;
  setState: Dispatch<SetStateAction<HighRiskContextState>>;
}
