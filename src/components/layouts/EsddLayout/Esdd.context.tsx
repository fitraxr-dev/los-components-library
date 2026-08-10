'use client';
import { createContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';


import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';


const initialState = {
  actionButtons: {},
  activeTab: 0,
  selectedTask: [],
};

export const ESDDContext = createContext(undefined);

export const ESDDProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [{ stepper }] = useApp();
  const path = usePathname();
  const steps = stepper.steps;

  useEffect(() => {

    if (steps) {
      const actions = steps.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action;
      setState({ ...state, actionButtons: actions });
    }
  }, [steps]);


  return (
    <ESDDContext.Provider value={[state, setState]}>
      {children}
    </ESDDContext.Provider>
  );
};


export const useESDDContext = () => {
  const [appState] = useApp();
  const stepper = appState.stepper;
  const goToNextStep = useGoToNextStep();

  return {
    goToNextStep,
    stepper,
  };
};
