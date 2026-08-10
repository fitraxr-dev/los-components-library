'use client';

import { createContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';


import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';


const initialState = {
  actionButtons: {},
  activeTab: 0,
  currentStatus: '',
  selectedTask: [],
};

// TODO: Remove this file after finished with integration since there's no consumer of this context
export const RisalahRapatContext = createContext(undefined);

export const RisalahRapatProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [{ stepper }] = useApp();
  const path = usePathname();
  const steps = stepper.steps;
  const { setViewOnly } = useViewOnly();

  useEffect(() => {
    const actions = steps?.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action;
    const viewOnly = steps?.filter((dt) => dt.urlPath === getLastPath(path))[0]?.enable;
    setState({ ...state, actionButtons: actions });
    setViewOnly(!viewOnly);
  }, [stepper, steps, path]);


  return (
    <RisalahRapatContext.Provider value={[state, setState]}>
      {children}
    </RisalahRapatContext.Provider>
  );
};


export const useRisalahRapatContext = () => {
  const [appState] = useApp();
  const stepper = appState.stepper;
  const router = useCustomRouter();
  const path = usePathname();


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


  return {
    goToNextStep,
    stepper,
  };
};
