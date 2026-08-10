'use client';
import { createContext, useContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';


const initialState = {
  actionButtons: {},
  activeTab: 0,
  currentRole: null,
  selectedTask: [],
};

export const LpaReviewContext = createContext(undefined);

export const LpaReviewProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [appState] = useApp();
  const stepper = appState.stepper;
  const path = usePathname();
  const currentRole = appState.currentRole;

  useEffect(() => {
    if (stepper) {
      const actionButtons = stepper.steps.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action;

      setState({ ...state, actionButtons, currentRole });
    }
  }, [stepper]);

  return (
    <LpaReviewContext.Provider value={[state, setState]}>
      {children}
    </LpaReviewContext.Provider>
  );
};

export const useLpaReviewContext = () => {
  const [appState] = useApp();
  const [state, setState] = useContext(LpaReviewContext);
  const stepper = appState.stepper;
  const router = useCustomRouter();
  const path = usePathname();
  const { setViewOnly } = useViewOnly();


  const { activeTab } = state;

  function goToNextStep() {
    const pathArray = path.split('/');
    pathArray.splice(pathArray.length - 1, 1);

    const steps = stepper.steps;
    const lastPath = getLastPath(path);
    const stepIndex = steps.findIndex((step) => step.urlPath === lastPath);
    const nextStep = steps[stepIndex + 1]?.urlPath;
    const nextPath = `${pathArray.join('/')}/${nextStep}`;
    router.push(nextPath);

    const viewOnly = !steps.find((step) => step.urlPath === nextStep)?.enable;
    setViewOnly(viewOnly);
  }

  function setActiveTab(tab: number) {
    const newState = structuredClone(state);
    newState.activeTab = tab;
    setState(newState);
  }

  return {
    activeTab,
    goToNextStep,
    setActiveTab,
    stepper,
  };
};
