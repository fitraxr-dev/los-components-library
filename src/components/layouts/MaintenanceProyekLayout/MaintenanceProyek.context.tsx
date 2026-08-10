'use client';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react';

import { maintenanceProyek } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';

import useMaintenanceProyek from './MaintenanceProyek.hook';


const initialState = {
  activeTab: 0,
  existingDebtorId: null,
  formDirtyStates: {
    contractor: false,
    informasiLainnya: false,
    projectInformation: false,
    projectOwner: false,
  },
  isExistingDebtor: false,
  percentage: 0,
  selectedTask: [],
};

export const MaintenanceProyekContext = createContext(undefined);

export const MaintenanceProyekProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Memoize the array [state, setState]
  const contextValue = useMemo(() => {
    return [state, setState];
  }, [state, setState]);

  return (
    <MaintenanceProyekContext.Provider value={contextValue}>
      {children}
    </MaintenanceProyekContext.Provider>
  );
};

export const useMaintenanceProyekContext = () => {
  const [appState] = useApp();

  const initiateBreadCrumb = [
    {
      label: 'Home',
      url: '/',
    },
    {
      label: 'Maintenance Proyek',
      url: maintenanceProyek.LIST_PAGE,
    }
  ];

  const stepper = appState.stepper;
  const goToNextStep = useGoToNextStep();
  const { renderDetailLayout } = useMaintenanceProyek();
  const [state, setState] = useContext(MaintenanceProyekContext);

  const isStaff = appState?.currentRole?.includes('STAFF');
  const { activeTab, breadCrumb, formDirtyStates } = state;

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

  // Set form dirty untuk halaman tertentu
  const setFormDirty = useCallback((page: 'projectInformation' | 'informasiLainnya' | 'projectOwner' | 'contractor', dirty: boolean) => {
    setState((prevState) => {

      if (prevState.formDirtyStates[page] !== dirty) {
        const newState = structuredClone(prevState);
        newState.formDirtyStates[page] = dirty;
        return newState;
      }
      return prevState;
    });
  }, []);

  const getFormDirty = useCallback((page: 'projectInformation' | 'informasiLainnya' | 'projectOwner' | 'contractor') => {
    return formDirtyStates[page] || false;
  }, [formDirtyStates]);

  const formDirty = getFormDirty('projectInformation');

  return {
    activeTab,
    breadCrumb,
    formDirty,
    formDirtyStates,
    getFormDirty,
    goToNextStep,
    handleSetBreadcrumb,
    isStaff,
    renderDetailLayout,
    setActiveTab,
    setFormDirty,
    stepper,
  };
};
