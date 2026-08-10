import { createContext, useContext, useState } from 'react';

import { uploadDatabaseDk } from '@/configs/constants/pathname';


const initialState = {
  activeTab: '',
};

export const UploadDatabaseDkContext = createContext(undefined);

export const UploadDatabaseDkProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <UploadDatabaseDkContext.Provider value={[state, setState]}>
      {children}
    </UploadDatabaseDkContext.Provider>
  );
};

export const useUploadDatabaseDkContext = () => {
  const [state, setState] = useContext(UploadDatabaseDkContext);

  const initiateBreadCrumb = [
    {
      label: 'Home',
      url: '/',
    },
    {
      label: 'Upload Database DK',
      url: uploadDatabaseDk.LIST_PAGE,
    }
  ];

  const { activeTab, breadCrumb } = state;

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
    handleSetBreadcrumb,
    setActiveTab,
    setState,
    state,
  };
};
