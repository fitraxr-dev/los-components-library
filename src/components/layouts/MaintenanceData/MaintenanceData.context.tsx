'use client';
import { createContext, useContext, useEffect, useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useViewOnly from '@/hooks/useViewOnly';


import { reducer } from '../AppLayout/App.constants';

import { mockSteps } from './MaintenanceData.constants';
import useMaintenanceData from './MaintenanceData.hook';


const initialState = {
  activeTab: 0,
  breadCrumb: [],
  existingDebtorId: null,
  isExistingDebtor: false,
  mockSteps: [],
  percentage: 0,
  selectedTask: [],
};

export const MaintenanceDataContext = createContext(undefined);

export const MaintenanceDataProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <MaintenanceDataContext.Provider value={[state, setState]}>
      {children}
    </MaintenanceDataContext.Provider>
  );
};

export const useMaintenanceDataContext = () => {
  const [appState] = useApp();
  const stepper = appState.stepper;
  const goToNextStep = useGoToNextStep();
  const { renderDetailLayout } = useMaintenanceData();
  const [state, setState] = useContext(MaintenanceDataContext);

  const { activeTab, breadCrumb } = state;
  const initiateBreadCrumb = [
    {
      label: 'Home',
      url: '/',
    },
    {
      label: 'Maintenance Customer',
      url: maintenanceDebtor.LIST_PAGE,
    }
  ];
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

  return {
    activeTab,
    breadCrumb,
    goToNextStep,
    handleSetBreadcrumb,
    renderDetailLayout,
    setActiveTab,
    stepper,
  };
};
