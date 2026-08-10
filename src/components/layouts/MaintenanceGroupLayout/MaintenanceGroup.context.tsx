'use client';
import { createContext, useContext, useState, useCallback } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { maintenanceDebtor, maintenanceGroup } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';

import useMaintenanceGroup from './MaintenanceGroup.hook';


const initialState = {
  activeTab: 0,
  breadCrumb: [],
  existingDebtorId: null,
  hasUnsavedChanges: false,
  isExistingDebtor: false,
  percentage: 0,
  selectedTask: [],
  stepperStepsWithChanges: [],
};

type ContextType = [typeof initialState, React.Dispatch<React.SetStateAction<typeof initialState>>];

export const MaintenanceGroupContext = createContext<ContextType>([initialState, () => {}]);

export const MaintenanceGroupProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <MaintenanceGroupContext.Provider value={[state, setState]}>
      {children}
    </MaintenanceGroupContext.Provider>
  );
};

export const useMaintenanceGroupContext = () => {
  const [appState] = useApp();
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
      label: 'Maintenance Group',
      url: maintenanceGroup.LIST_PAGE,
    }
  ];

  const stepper = appState.stepper;
  const goToNextStep = useGoToNextStep();
  const { renderDetailLayout } = useMaintenanceGroup();
  const [state, setState] = useContext(MaintenanceGroupContext);

  const isRM = appState?.currentRole?.includes('STAFF');
  const isSuperAdminMaker = appState?.currentRole?.includes('MAKER');
  const { activeTab, breadCrumb } = state;

  const handleSetBreadcrumb = (params) => {
    const newBreadCrumb = [
      ...initiateBreadCrumb, ...params
    ];
    setState((prevState) => {
      if (JSON.stringify(newBreadCrumb) === JSON.stringify(prevState.breadCrumb)) {
        return prevState;
      }
      const newState = {
        ...prevState,
        breadCrumb: newBreadCrumb,
      };
      return newState;
    });
  };

  function setActiveTab(tab: number) {
    setState((prevState) => {
      const newState = {
        ...prevState,
        activeTab: tab,
      };
      return newState;
    });
  }

  const setStepperStepsWithChanges = useCallback((steps) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        stepperStepsWithChanges: steps,
      };
      return newState;
    });
  }, []);

  const setHasUnsavedChanges = useCallback((hasChanges: boolean) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        hasUnsavedChanges: hasChanges,
      };
      return newState;
    });
  }, []);


  return {
    activeTab,
    breadCrumb,
    goToNextStep,
    handleSetBreadcrumb,
    hasUnsavedChanges: state.hasUnsavedChanges,
    isRM,
    isSuperAdminMaker,
    renderDetailLayout,
    setActiveTab,
    setHasUnsavedChanges,
    setStepperStepsWithChanges,
    stepper,
    stepperStepsWithChanges: state.stepperStepsWithChanges,
  };
};
