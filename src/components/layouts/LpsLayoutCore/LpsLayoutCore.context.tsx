'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  BUSINESS_DIVISION,
  DPB_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DUS_DIVISION,
  SECOND_FINANCING_DIVISION,
} from '@/configs/constants';
import { loanProcessingSummary } from '@/configs/constants/pathname';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useDivision from '@/hooks/useDivision';


const initialState = {
  actionButtons: {},
  isDocumentSelected: false,
};

export const LpsCoreContext = createContext(undefined);

export const LpsCoreProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [appState] = useApp();
  const stepper = appState.stepper;
  const lastPath = getLastPath(loanProcessingSummary.FINANCING_FACILITY);


  useEffect(() => {
    if (stepper) {
      const btnAction = stepper.steps?.find((step) => step?.urlPath === lastPath && typeof step.action === 'object')?.action;

      setState((prev) => {
        if (prev.actionButtons === btnAction) return prev;
        return { ...prev, actionButtons: btnAction };
      });
    }
  }, [stepper, lastPath]);

  return (
    <LpsCoreContext.Provider value={[state, setState]}>
      {children}
    </LpsCoreContext.Provider>
  );
};

export const useLpsCoreContext = () => {
  const [state, setState] = useContext(LpsCoreContext);
  const { divisionCode } = useDivision();

  const divisiBisnisArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_3_DIVISION
  ];

  const isDivisiBisnis = divisiBisnisArray.includes(divisionCode);


  const setIsDocumentSelected = useCallback(
    (value: boolean) => setState((prev) => {
      if (prev.isDocumentSelected === value) return prev;
      return { ...prev, isDocumentSelected: value };
    }),
    []
  );

  return {
    actionButtons: state?.actionButtons,
    isDivisiBisnis,
    isDocumentSelected: state?.isDocumentSelected,
    setIsDocumentSelected,
  };
};
