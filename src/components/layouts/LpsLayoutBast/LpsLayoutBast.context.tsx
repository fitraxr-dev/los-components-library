'use client';
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
} from '@/configs/constants';
import { loanProcessingSummary } from '@/configs/constants/pathname';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useDivision from '@/hooks/useDivision';


const initialState = {
  actionButtons: {},
  isDocumentSelected: false,
  stepperStatus: '',
};

export const LpsBastContext = createContext(undefined);

export const LpsBastProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [appState] = useApp();
  const stepper = appState.stepper;
  const lastPath = getLastPath(loanProcessingSummary.ADDITIONAL_INFORMATION_PAGE);


  useEffect(() => {
    if (stepper) {
      const btnAction = stepper.steps?.find((step) => step?.urlPath === lastPath && typeof step.action === 'object')?.action;
      setState((prev) => {
        const sameAction = prev.actionButtons === btnAction;
        const sameStatus = prev.stepperStatus === stepper?.from;
        if (sameAction && sameStatus) return prev;
        return {
          ...prev,
          actionButtons: sameAction ? prev.actionButtons : btnAction,
          stepperStatus: stepper?.from,
        };
      });
    }
  }, [stepper, lastPath]);

  return (
    <LpsBastContext.Provider value={[state, setState]}>
      {children}
    </LpsBastContext.Provider>
  );
};

export const useLpsBastContext = () => {
  const [state, setState] = useContext(LpsBastContext);
  const { divisionCode } = useDivision();
  const [{ currentRole }] = useApp();
  const isMaker = currentRole.includes('MAKER');
  const isChecker = currentRole.includes('CHECKER');
  const isSuperAdmin = isMaker || isChecker;

  const divisiBisnisArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION];

  const isDivisiBisnis = divisiBisnisArray.includes(divisionCode);

  const setIsDocumentSelected = useCallback((value: boolean) => {
    setState((prevState) => {
      if (prevState.isDocumentSelected === value) return prevState;
      return { ...prevState, isDocumentSelected: value };
    });
  }, [setState]);

  return {
    actionButtons: state?.actionButtons,
    isChecker,
    isDivisiBisnis,
    isDocumentSelected: state?.isDocumentSelected,
    isMaker,
    isSuperAdmin,
    setIsDocumentSelected,
    stepperStatus: state?.stepperStatus,
  };
};
