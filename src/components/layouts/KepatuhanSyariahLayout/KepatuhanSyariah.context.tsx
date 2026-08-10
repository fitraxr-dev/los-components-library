'use client';
import { createContext, useContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';


const initialState = {
  actionButtons: {},
  activeTab: 0,
  selectedTask: [],
};

export const KepatuhanSyariahContext = createContext(undefined);

export const KepatuhanSyariahProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [appState] = useApp();
  const stepper = appState.stepper;
  const path = usePathname();

  useEffect(() => {
    if (stepper) {
      const actionButtons = stepper.steps.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action;

      setState({ ...state, actionButtons });
    }
  }, [stepper]);

  return (
    <KepatuhanSyariahContext.Provider value={[state, setState]}>
      {children}
    </KepatuhanSyariahContext.Provider>
  );
};

export const useKepatuhanSyariahContext = () => {
  const [appState] = useApp();
  const [state, setState] = useContext(KepatuhanSyariahContext);
  const stepper = appState.stepper;
  const router = useCustomRouter();
  const path = usePathname();


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
