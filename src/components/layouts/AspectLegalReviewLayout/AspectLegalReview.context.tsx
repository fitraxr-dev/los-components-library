'use client';
import { createContext, useEffect, useState } from 'react';


import { ASPECT_LEGAL_REVIEW } from '@/configs/constants/pathname';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';

import type { ReactNode } from 'react';


const initialState = {
  actionButtons: {},
  selectedTask: [],
  tabActive: '',

};


export const AspectLegalReviewContext = createContext(undefined);

export const AspectLegalReviewcProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(initialState);
  const [appState] = useApp();
  const stepper = appState.stepper;
  const lastPath = getLastPath(ASPECT_LEGAL_REVIEW.ADDITIONAL_INFORMATION_PAGE);
  const goToNextStep = useGoToNextStep();

  const updateActionButtons = () => {
    const btnAction = stepper.steps?.find((step) => step?.urlPath === lastPath && typeof step.action === 'object')?.action;
    setState({ ...state, actionButtons: btnAction });
  };

  useEffect(updateActionButtons, [stepper]);


  return (
    <AspectLegalReviewContext.Provider
      value={{
        goToNextStep,
        setState,
        state,
      }}
    >
      {children}
    </AspectLegalReviewContext.Provider>
  );
};
