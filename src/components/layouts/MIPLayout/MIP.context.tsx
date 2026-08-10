import { createContext, useState } from 'react';

import { usePathname } from 'next/navigation';


import { mip, analyst } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


export const MIPContext = createContext<any>(
  {
    goToNextStep: () => {},
    viewOnly: false,
  }
);

export const MIPProvider = ({ children }) => {
  const [appState] = useApp();
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const path = usePathname();

  const steps = appState.stepper.steps;

  function goToNextStep() {
    const currentPath = path.split('/')[3];
    const mipPath = currentPath === 'mip';
    const lastPath = getLastPath(path);
    const stepIndex = steps.findIndex((step) => step.urlPath === lastPath);
    const basePath = mipPath ? mip.MIP_DETAIL : analyst.MIP_DETAIL;
    const nextStep = steps[stepIndex + 1]?.urlPath;
    const nextPath = replacePath(basePath, { processId }) + nextStep;
    router.push(nextPath);
  }

  return (
    <MIPContext.Provider value={{ goToNextStep, viewOnly }}>
      {children}
    </MIPContext.Provider>
  );
};

export const useMIPContext = () => {
  const [{ stepper }] = useApp();
  const pathname = usePathname();

  const actions = stepper.steps.find((step) => step.urlPath === getLastPath(pathname))?.action;

  return {
    actions,
  };
};
