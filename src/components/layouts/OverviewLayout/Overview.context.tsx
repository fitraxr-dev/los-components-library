'use client';

import { createContext, useContext, useState } from 'react';

import { usePathname } from 'next/navigation';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DP_2_DIVISION,
  DPOP_DIVISION,
  DEPI_DIVISION,
  DK_DIVISION,
  DH_DIVISION,
  DELST_DIVISION,
  DKHI_DIVISION,
  DPKMI_DIVISION,
  DPPIK_DIVISION,
  DTI_DIVISION,
  positions,
} from '@/configs/constants';
import useApp from '@/hooks/useApp';
import useDivision from '@/hooks/useDivision';


interface OverviewState {
  selectedPeriod: string;
  selectedTeam: string;
  selectedStaff: string;
  isBusinessDivision: boolean;
  isNonBusinessDivision?: boolean;
}

type OverviewContextType = [
  OverviewState,
  React.Dispatch<React.SetStateAction<OverviewState>>
];

const initialState: OverviewState = {
  isBusinessDivision: true,
  isNonBusinessDivision: false,
  selectedPeriod: 'Nov 2023 - Apr 2024',
  selectedStaff: 'All',
  selectedTeam: 'All',
};

const OverviewContext = createContext<OverviewContextType | undefined>(undefined);

export const OverviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<OverviewState>(initialState);

  return (
    <OverviewContext.Provider value={[state, setState]}>
      {children}
    </OverviewContext.Provider>
  );
};

export const useOverviewContext = () => {
  const context = useContext(OverviewContext);
  if (context === undefined) {
    throw new Error('useOverviewContext must be used within an OverviewProvider');
  }

  const [{ currentRole, currentPosition }] = useApp();
  const { divisionCode, divisionName } = useDivision();
  const path = usePathname();

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_3_DIVISION,
    DP_2_DIVISION,
  ];
  const isBusinessDivision = businessDivisionArray.includes(divisionCode);
  const nonBusinessDivisionArray = [
    DPOP_DIVISION,
    DEPI_DIVISION,
    DK_DIVISION,
    DH_DIVISION,
    DELST_DIVISION,
    DKHI_DIVISION,
    DPKMI_DIVISION,
    DPPIK_DIVISION,
    DTI_DIVISION,
  ];
  const isNonBusinessDivision = nonBusinessDivisionArray.includes(divisionCode);
  const isKadiv = currentRole.includes('KADIV');
  const isTL = currentRole.includes('TL');
  const isRM = currentRole.includes('STAFF');
  const isMaker = currentRole.includes('MAKER');
  const isDirektur = currentRole.includes('BOD');
  const isChecker = currentRole.includes('CHECKER');
  const isTaskForce = currentPosition.includes('TASK_FORCE');
  const isDti = divisionCode === DTI_DIVISION;

  const isInternalGuest = currentPosition?.some((pos: string) =>
    pos.toUpperCase().includes(positions.INTERNAL_GUEST.toUpperCase())
  );

  const targetDivisions = [
    BUSINESS_DIVISION,
    DP_2_DIVISION,
    DPPU_1_DIVISION,
    DPPU_3_DIVISION,
    DUS_DIVISION,
    DPB_DIVISION,
    DTI_DIVISION,
  ];

  const [state, setState] = context;
  const extendedState = {
    ...state,
    isBusinessDivision,
    isNonBusinessDivision,
  };

  return {
    divisionCode,
    divisionName,
    isBusinessDivision,
    isChecker,
    isDirektur,
    isDti,
    isInternalGuest,
    isKadiv,
    isMaker,
    isNonBusinessDivision,
    isRM,
    isTL,
    isTaskForce,
    path,
    setState,
    state: extendedState,
    targetDivisions,
  };
};
