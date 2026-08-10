import { createContext, useState } from 'react';

import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { TypeDivision } from '@/enums/Division';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useDivision from '@/hooks/useDivision';

import type { ReactNode } from 'react';


const initialState = {
  activeTab: '',
};

const ConclusionContext = createContext(undefined);

export const ConclusionProvider = ({ children }: {children: ReactNode}) => {
  const [state, setState] = useState(initialState);

  return (
    <ConclusionContext.Provider value={{ setState, state }}>
      {children}
    </ConclusionContext.Provider>
  );
};

export const useConclusionContext = () => {
  const [{ currentRole, stepper, userData }] = useApp();
  const pathname = usePathname();
  const { divisionCode } = useDivision();

  const isRm = currentRole.includes(roles.RM);
  const isMaker = currentRole.includes(roles.MAKER);
  const isKadiv = currentRole.includes(roles.KADIV);
  const currentStep = stepper.steps.find((step) => step.urlPath === getLastPath(pathname));
  const actionButtons: Object = currentStep?.action;
  const isCurrentStepDone = currentStep?.isDone;
  const isDkDivision = divisionCode === TypeDivision.DK_DIVISION;

  return {
    actionButtons,
    isCurrentStepDone,
    isDkDivision,
    isKadiv,
    isMaker,
    isRm,
  };
};
