import { createContext, useContext, useState } from 'react';

import { usePathname } from 'next/navigation';


import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';


const initialState = {
  activeTab: 0,
};
export const MUPContext = createContext(undefined);

export const MUPProvider = ({ children }) => {
  const [mupState, setMupState] = useState(initialState);

  return (
    <MUPContext.Provider value={[mupState, setMupState]}>
      {children}
    </MUPContext.Provider>
  );
};

export const useMUPContext = () => {
  const [appState] = useApp();
  const [state, setState] = useContext(MUPContext);
  const { activeTab } = state;
  const stepper = appState.stepper;
  const router = useCustomRouter();
  const path = usePathname();

  const isStaff = appState.currentRole.includes('STAFF');
  const isTL = appState.currentRole.includes('TL');
  const isKadiv = appState.currentRole.includes('KADIV');
  const isChecker = appState.currentRole.includes('CHECKER');
  const isMaker = appState.currentRole.includes('MAKER');

  let filterStatusMup = '';
  if (isStaff || isMaker) filterStatusMup = 'mupStatusFilterStaff';
  else if (isTL) filterStatusMup = 'mupStatusFilterTL';
  else if (isKadiv || isChecker) filterStatusMup = 'mupStatusFilterKadiv';

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
    filterStatusMup,
    goToNextStep,
    setActiveTab,
    stepper,
  };
};
