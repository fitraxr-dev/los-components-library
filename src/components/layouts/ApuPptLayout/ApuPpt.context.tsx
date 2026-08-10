'use client';
import { createContext, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';


import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  DPOP_DIVISION,
} from '@/configs/constants';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import setPreviewPage from '@/hooks/useSetPreviewPage';


export const ApuPptContext = createContext(undefined);

export const ApuPptProvider = ({ children }) => {
  const [state, setState] = useState({});

  return (
    <ApuPptContext.Provider value={{ setState, state }}>
      {children}
    </ApuPptContext.Provider>
  );
};

export const useApuPptContext = () => {
  const [{ stepper, currentRole, currentPosition }] = useApp();
  const path = usePathname();
  const router = useCustomRouter();
  const { divisionCode } = useDivision();
  const searchParams = useSearchParams();

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
  const isDpopDivision = divisionCode.includes(DPOP_DIVISION);
  const isKadiv = currentRole.includes('KADIV');
  const isTL = currentRole.includes('TL');
  const isRM = currentRole.includes('STAFF');
  const isPreview = searchParams.get('isPreview');

  const tempCurrentPosition = currentPosition.map((position) => position.toUpperCase());
  const isSuperAdmin = tempCurrentPosition.includes('SUPER_ADMIN_MAKER') || currentPosition.includes('SUPER_ADMIN');


  let currentUserDivision;

  if (isBusinessDivision) currentUserDivision = BUSINESS_DIVISION;
  else if (isDpopDivision) currentUserDivision = DPOP_DIVISION;

  const goToNextStep = () => {
    const pathArray = path.split('/');
    pathArray.splice(pathArray.length - 1, 1);
    const steps = stepper.steps;
    const lastPath = getLastPath(path);
    const stepIndex = steps.findIndex((step) => step.urlPath === lastPath);
    const nextStep = steps[stepIndex + 1]?.urlPath;
    const nextPath = `${pathArray.join('/')}/${nextStep}`;
    isPreview ? router.push(setPreviewPage(nextPath)) : router.push(nextPath);
  };
  const isRequest = stepper?.from?.includes('REQUEST');
  const actions: Object = stepper.steps.find((step) => step.urlPath === getLastPath(path))?.action;
  const currentListPage = path.split('/').splice(0, 4).join('/');

  return {
    actions,
    currentListPage,
    currentUserDivision,
    goToNextStep,
    isBusinessDivision,
    isDpopDivision,
    isKadiv,
    isRM,
    isRequest,
    isSuperAdmin,
    isTL,
    stepper,
  };
};
