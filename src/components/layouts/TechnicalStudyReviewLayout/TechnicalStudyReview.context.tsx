'use client';
import { createContext, useContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


const initialState = {
  activeTab: 0,
  selectedTask: [],
};

export const TechnicalStudyReviewContext = createContext(undefined);

export const TechnicalStudyReviewProvider = ({ children }) => {
  const [_state, setState] = useState(initialState);
  const [{ currentRole, currentPosition, stepper }] = useApp();
  const { setViewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const bucketPrefix = processId?.split('-')[0];
  const isKadivDelst = currentRole?.includes('KADIV') && currentPosition?.includes('SPECIALIST');

  useEffect(() => {
    if (isKadivDelst) {
      if (bucketPrefix === 'TR') {
        setViewOnly(true);
      }
      if (bucketPrefix === 'TRD') {
        setViewOnly(false);
      }
    }

  }, [stepper]);

  return (
    <TechnicalStudyReviewContext.Provider value={[_state, setState]}>
      {children}
    </TechnicalStudyReviewContext.Provider>
  );
};

export const useTechnicalStudyReviewContext = () => {
  const [appState] = useApp();
  const stepper = appState.stepper;

  const router = useCustomRouter();
  const path = usePathname();
  const isRequestModule = path.split('/').includes('request');

  const [state, setState] = useContext(TechnicalStudyReviewContext);
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
    isRequestModule,
    setActiveTab,
    stepper,
  };
};
