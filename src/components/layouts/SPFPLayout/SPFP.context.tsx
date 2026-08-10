'use client';

import { createContext, useContext, useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';


import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import type { ModuleProps } from './SPFP.types';


const initialState = {
  module: TypeModule.SPFP,
  process: TypeProcess.SPFP,
  tabActive: '',
};

export const SpfpContext = createContext(undefined);

const SpfpBucketContext = createContext<ModuleProps>({
  bucketProcessId: '',
  module: TypeModule.SPFP,
  process: TypeProcess.SPFP,
});

export const useSpfpBucketContext = () => useContext(SpfpBucketContext);

export const SpfpProvider = ({ children }) => {
  const { processId } = useIdentity();
  const [state, setState] = useState(initialState);
  const path = usePathname();

  const bucket = useMemo(() => {
    if (path.split('/').length > 5 && !!processId) {
      const bucketPrefix = processId.split('-')[0];
      let process;
      switch (bucketPrefix) {
        case 'SPFP':
          process = TypeProcess.SPFP;
          break;
        case 'SPF':
          process = TypeProcess.SPFP_FINAL;
          break;
        case 'SPDP':
          process = TypeProcess.SPDP;
          break;
        default:
          process = TypeProcess.SPFP;
          break;
      }

      return {
        bucketProcessId: processId,
        module: TypeModule.SPFP,
        process: process,
      };
    } else {
      return {
        bucketProcessId: processId,
        module: TypeModule.SPFP,
        process: TypeProcess.SPFP,
      };
    }
  }, [processId]);

  return (
    <SpfpBucketContext.Provider value={bucket}>
      <SpfpContext.Provider value={[state, setState]}>
        {children}
      </SpfpContext.Provider>
    </SpfpBucketContext.Provider>
  );
};

export const useSpfpContext = () => {
  const [appState] = useApp();
  const stepper = appState.stepper;
  const router = useCustomRouter();
  const path = usePathname();

  const [state, setState] = useContext(SpfpContext);
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
