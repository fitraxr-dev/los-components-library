import { createContext, useContext, useMemo, useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import {
  BUSINESS_DIVISION,
  DEPI_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  DUS_DIVISION,
  SECOND_FINANCING_DIVISION,
} from '@/configs/constants';
import { TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useDivision from '@/hooks/useDivision';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useViewOnly from '@/hooks/useViewOnly';

import type { ReactNode } from 'react';


type AnnualReviewState = {
  goToNextStep: () => void;
  viewOnly: boolean;
  actions: Object;
  currentUserDivision?: string;
  isAnalyst?: boolean;
  isBusinessDivision?: boolean;
  isChecker?: boolean;
  isDepiDivision?: boolean;
  isKadiv?: boolean;
  isMaker?: boolean;
  isRM?: boolean;
  isTL?: boolean;
  typeProcess?: string;
};

type AnnualReviewContextInterface = [
  AnnualReviewState,
  React.Dispatch<React.SetStateAction<AnnualReviewState>>
]

export const AnnualReviewContext = createContext<AnnualReviewContextInterface>(undefined);

export const AnnualReviewProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AnnualReviewState>();

  return (
    <AnnualReviewContext.Provider
      value={[state, setState]}
    >
      {children}
    </AnnualReviewContext.Provider>
  );
};

export const useAnnualReviewContext = () => {
  const context = useContext(AnnualReviewContext);
  if (!context) {
    throw new Error('useAnnualReviewContext must be used within a AnnualReviewProvider');
  }

  const [{ stepper, currentRole, currentPosition }] = useApp();
  const path = usePathname();
  const params = useParams();
  const { divisionCode } = useDivision();
  const { viewOnly } = useViewOnly();
  const goToNextStep = useGoToNextStep();

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
  ];
  const isBusinessDivision = businessDivisionArray?.includes(divisionCode);
  const isDepiDivision = divisionCode.includes(DEPI_DIVISION);
  const isKadiv = currentRole.includes('KADIV');
  const isTL = currentRole.includes('TL');
  const isRM = currentRole.includes('STAFF');
  const isMaker = currentRole.includes('MAKER');
  const isChecker = currentRole.includes('CHECKER');
  const isAnalyst = currentPosition.some((pos) => pos.toUpperCase().includes('ANALYST'));

  let currentUserDivision: string;

  if (isBusinessDivision) currentUserDivision = BUSINESS_DIVISION;
  else if (isDepiDivision) currentUserDivision = DEPI_DIVISION;

  const actions: Object = stepper.steps.find((step) => step.urlPath === getLastPath(path))?.action;

  const typeProcess = useMemo(() => {
    switch (params?.pageModule) {
      case 'assignment':
      case 'verification':
      case 'monitoring':
        return TypeProcess.ANNUAL_REVIEW_DEPI;
      case 'analyst':
        return TypeProcess.ANNUAL_REVIEW_ANALYST;
      case 'request':
      default:
        return TypeProcess.ANNUAL_REVIEW;
    }
  }, [params?.pageModule]);

  return {
    actions,
    currentUserDivision,
    goToNextStep,
    isAnalyst,
    isBusinessDivision,
    isChecker,
    isDepiDivision,
    isKadiv,
    isMaker,
    isRM,
    isTL,
    typeProcess,
    viewOnly,
  };
};
