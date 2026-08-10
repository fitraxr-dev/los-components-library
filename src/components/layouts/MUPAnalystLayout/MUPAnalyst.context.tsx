import { createContext, useContext, useState } from 'react';

import { usePathname } from 'next/navigation';


import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';

import useMUPAnalyst from './MUPAnalyst.hook';


const initialState = {
  activeTab: 0,
};
export const MUPAnalystContext = createContext(undefined);

export const MUPProvider = ({ children }) => {
  const [mupState, setMupState] = useState(initialState);

  return (
    <MUPAnalystContext.Provider value={[mupState, setMupState]}>
      {children}
    </MUPAnalystContext.Provider>
  );
};

export const useMUPAnalystContext = () => {
  const [appState] = useApp();
  const { bucketParentId } = useMUPAnalyst();
  const [state, setState] = useContext(MUPAnalystContext);
  const { activeTab } = state;
  const stepper = appState.stepper;
  const router = useCustomRouter();
  const path = usePathname();

  const goToNextStep = () => {
    const pathArray = path.split('/');
    pathArray.splice(pathArray.length - 1, 1);
    const steps = stepper.steps;
    const lastPath = getLastPath(path);
    const stepIndex = steps.findIndex((step) => step.urlPath === lastPath);
    const nextStep = steps[stepIndex + 1]?.urlPath;
    const nextPath = `${pathArray.join('/')}/${nextStep}`;
    router.push(nextPath);
  };

  const setActiveTab = (tab: number) => {
    const newState = structuredClone(state);
    newState.activeTab = tab;
    setState(newState);
  };

  const actionButtons: Object = stepper.steps.find((step) => step.urlPath === getLastPath(path))?.action;

  return {
    actionButtons,
    activeTab,
    bucketParentId,
    goToNextStep,
    setActiveTab,
    stepper,
  };
};
