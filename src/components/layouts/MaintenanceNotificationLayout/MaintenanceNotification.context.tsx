'use client';
import { createContext, useContext, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { maintenanceNotification } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useGoToNextStep from '@/hooks/useGoToNextStep';

import useMaintenanceNotification from './MaintenanceNotification.hook';


const initialState = {
  activeTab: 0,
  activeType: '',
  existingDebtorId: null,
  // formData: null,
  isExistingDebtor: false,
  isNotificationActive: false,
  notificationType: '',
  percentage: 0,
  selectedTask: [],
};

export const MaintenanceNotificationContext = createContext(undefined);

export const MaintenanceNotificationProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <MaintenanceNotificationContext.Provider value={[state, setState]}>
      {children}
    </MaintenanceNotificationContext.Provider>
  );
};

export const useMaintenanceNotificationContext = () => {
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
      label: 'Maintenance Notification',
      url: maintenanceNotification.LIST_PAGE,
    }
  ];

  const stepper = appState.stepper;
  const goToNextStep = useGoToNextStep();
  const { renderDetailLayout } = useMaintenanceNotification();
  const [state, setState] = useContext(MaintenanceNotificationContext);

  const isRM = appState?.currentRole?.includes('STAFF');
  const { activeTab, breadCrumb, isNotificationActive } = state;

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

  function setIsNotificationActive(val) {
    setState((prev) => {
      if (prev.isNotificationActive === val) return prev; // tidak update kalau sama
      return { ...prev, isNotificationActive: val };
    });
  }

  function setActiveType(val) {
    setState((prev) => {
      if (prev.activeType === val) return prev; // tidak update kalau sama
      return { ...prev, activeType: val };
    });
  }

  function setNotificationType(val) {
    setState((prev) => {
      if (prev.notificationType === val) return prev; // tidak update kalau sama
      return { ...prev, notificationType: val };
    });
  }

  function setMediaType(val) {
    setState((prev) => {
      if (prev.mediaType === val) return prev; // tidak update kalau sama
      return { ...prev, mediaType: val };
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
    setIsNotificationActive,
    setMediaType,
    setNotificationType,
    stepper,
  };
};
