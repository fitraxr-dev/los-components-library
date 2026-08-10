'use client';
import { createContext, useContext, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { maintenanceReminder } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';

import useMaintenanceReminder from './MaintenanceReminder.hook';


const initialState = {
  activeTab: 0,
  activeType: '',
  existingDebtorId: null,
  // formData: null,
  isExistingDebtor: false,
  isReminderActive: false,
  percentage: 0,
  reminderType: '',
  selectedTask: [],
};

export const MaintenanceReminderContext = createContext(undefined);

export const MaintenanceReminderProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <MaintenanceReminderContext.Provider value={[state, setState]}>
      {children}
    </MaintenanceReminderContext.Provider>
  );
};

export const useMaintenanceReminderContext = () => {
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
      label: 'Maintenance Reminder',
      url: maintenanceReminder.LIST_PAGE,
    }
  ];

  const stepper = appState.stepper;
  const goToNextStep = useGoToNextStep();
  const { renderDetailLayout } = useMaintenanceReminder();
  const [state, setState] = useContext(MaintenanceReminderContext);

  const isRM = appState?.currentRole?.includes('STAFF');
  const { activeTab, breadCrumb, isReminderActive } = state;

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

  function setIsReminderActive(val) {
    setState((prev) => {
      if (prev.isReminderActive === val) return prev; // tidak update kalau sama
      return { ...prev, isReminderActive: val };
    });
  }

  function setActiveType(val) {
    setState((prev) => {
      if (prev.activeType === val) return prev; // tidak update kalau sama
      return { ...prev, activeType: val };
    });
  }

  function setReminderType(val) {
    setState((prev) => {
      if (prev.reminderType === val) return prev; // tidak update kalau sama
      return { ...prev, reminderType: val };
    });
  }

  return {
    activeTab,
    breadCrumb,
    goToNextStep,
    handleSetBreadcrumb,
    isRM,
    // isReminderActive,
    renderDetailLayout,
    setActiveTab,
    ...state,
    setActiveType,
    setIsReminderActive,
    setReminderType,
    stepper,
  };
};
