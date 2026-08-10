'use client';
import { createContext, useCallback, useContext, useState } from 'react';

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
} from '@/configs/constants';
import { maintenanceModal } from '@/configs/constants/pathname';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';

import useMaintenanceModal from './MaintenanceModal.hook';


const initialState = {
  activeTab: 0,
  existingDebtorId: null,
  isExistingDebtor: false,
  percentage: 0,
  selectedTask: [],
};

export const MaintenanceModalContext = createContext(undefined);

export const MaintenanceModalProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <MaintenanceModalContext.Provider value={[state, setState]}>
      {children}
    </MaintenanceModalContext.Provider>
  );
};

export const useMaintenanceModalContext = () => {
  const [{ stepper, currentRole }] = useApp();
  const params = useSearchParams();
  const path = usePathname();
  const pathArray = path.split('/');
  const maintenanceIndex = pathArray[2];

  const initiateBreadCrumb = [
    {
      label: 'Home',
      url: '/',
    },
    {
      label: 'Maintenance Modal',
      url: maintenanceModal.MAIN_PAGE,
    }
  ];

  const goToNextStep = useGoToNextStep();
  const { renderDetailLayout } = useMaintenanceModal();
  const [state, setState] = useContext(MaintenanceModalContext);

  const isRM = currentRole?.includes('STAFF');
  const isSuperAdminMaker = currentRole?.includes('MAKER');
  const isSuperAdminChecker = currentRole?.includes('CHECKER');
  const isTL = currentRole?.includes('TL');
  const isKadiv = currentRole?.includes('KADIV');
  const { activeTab, breadCrumb } = state;

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION];

  const isBusinessDivision = true;

  const handleSetBreadcrumb = (params) => {
    const newState = structuredClone(state);
    newState.breadCrumb = [
      ...initiateBreadCrumb, ...params
    ];
    setState(newState);
  };

  function setActiveTab(tab: number) {
    const newState = structuredClone(state);
    newState.activeTab = tab;
    setState(newState);
  }

  const setFormProgress = useCallback((progress: number) => {
    setState((prevState) => {
      const newState = structuredClone(prevState);
      newState.formProgress = progress;
      return newState;
    });
  }, []);

  const actions = stepper.steps.find((item) => item.urlPath === getLastPath(path))?.action ?? {};

  const isWaitingApprovalChecker = stepper?.from === 'WAITING_APPROVAL_CHECKER';

  return {
    actions,
    activeTab,
    breadCrumb,
    formProgress: state.formProgress,
    goToNextStep,
    handleSetBreadcrumb,
    isBusinessDivision,
    isKadiv,
    isRM,
    isSuperAdminChecker,
    isSuperAdminMaker,
    isTL,
    isWaitingApprovalChecker,
    renderDetailLayout,
    setActiveTab,
    setFormProgress,
    stepper,
  };
};
