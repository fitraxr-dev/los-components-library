'use client';
import { createContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';

import type { ReactNode } from 'react';


export const LegalSigningContext = createContext(undefined);


const initialState = {
  actionButtons: {},
};

export const LegalSigningProvider = ({ children }: {children: ReactNode}) => {
  const [state, setState] = useState(initialState);
  const [appState] = useApp();
  const stepper = appState.stepper;
  const path = usePathname();

  useEffect(() => {
    if (stepper) {
      const actions = stepper.steps.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action;

      setState({ ...state, actionButtons: actions });

    }
  }, [stepper]);


  return (
    <LegalSigningContext.Provider
      value={{
        setState,
        state,
      }}
    >
      {children}
    </LegalSigningContext.Provider>
  );
};
