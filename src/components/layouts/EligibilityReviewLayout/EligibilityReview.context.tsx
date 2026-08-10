'use client';
import { createContext, useState, useEffect, useContext } from 'react';

import { usePathname } from 'next/navigation';


import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';


const initialState = {
  actionButtons: {},
  activeTab: 0,
  selectedTask: [],
};

export const EligibilityReviewContext = createContext(undefined);

export const EligibilityReviewProvider = ({ children }) => {
  const path = usePathname();
  const [state, setState] = useState(initialState);
  const [appState] = useApp();
  const stepper = appState.stepper;

  useEffect(() => {
    if (stepper && stepper.steps) {
      const actions = stepper.steps.find((step) => step.urlPath === getLastPath(path))?.action;
      setState((prevState) => ({
        ...prevState,
        actionButtons: actions,
      }));
    }
  }, [stepper, path]);


  return (
    <EligibilityReviewContext.Provider value={[state, setState]}>
      {children}
    </EligibilityReviewContext.Provider>
  );
};

export const useEligibilityReviewContext = () => {
  const [appState] = useApp();
  const [state] = useContext(EligibilityReviewContext);
  const stepper = appState.stepper;
  const goToNextStep = useGoToNextStep();
  const { activeTab } = state;

  return {
    activeTab,
    goToNextStep,
    stepper,
  };
};
