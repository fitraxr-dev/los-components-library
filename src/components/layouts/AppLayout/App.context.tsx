'use client';
import { createContext, useEffect, useMemo, useReducer } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';


import { APP_CONTEXT_PERSIST, ENCRYPT_KEY } from '@/configs/constants/general';
import { getCookie } from '@/helpers/cookie';
import { decrypt, encrypt } from '@/helpers/crypto';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGetProfile from '@/hooks/useGetProfile';

import { reducer } from './App.constants';
import appReducer from './App.reducer';


let appContextPersistJson = null;
if (process.env.NODE_ENV === 'production') {
  if (typeof localStorage !== 'undefined') {
    const appContextPersist = localStorage.getItem(APP_CONTEXT_PERSIST);
    appContextPersistJson = appContextPersist && JSON.parse(decrypt(appContextPersist, ENCRYPT_KEY));
  }
} else {
  if (typeof localStorage !== 'undefined') {
    const appContextPersist = localStorage.getItem(APP_CONTEXT_PERSIST);
    appContextPersistJson = appContextPersist && JSON.parse(decrypt(appContextPersist, ENCRYPT_KEY));
  }
}

const initialState = appContextPersistJson || {
  currentPosition: [],
  currentRole: [],
  darkMode: false,
  identity: {
    analystId: '',
    childId: '',
    debiturName: '',
    debtorId: '',
    facilityId: '',
    parentId: '',
    processId: '',
  },
  language: 'id',
  pages: {},
  stepper: {
    from: null,
    progress: null,
    steps: [],
  },
  userData: null,
  viewOnly: false,
};

const AppStateContext = createContext(undefined);
const AppDispatchContext = createContext(undefined);

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const { data: dataProfile } = useGetProfile();

  useMemo(() => {
    if (dataProfile) {
      const profile = { ...dataProfile.accessManagementActive, user: {} };
      // TEMPORARY FIX buat compatibility dengan api dulu
      for (const [key, value] of Object.entries(dataProfile)) {
        if (profile[key] !== 'accessManagementActive' || profile[key] !== 'accessManagements') {
          profile.user[key] = value;
        }
      }
      const { roleCode } = profile?.userRoleRefactor;
      const currentRole = [roleCode];
      const currentPosition = profile?.userPosition?.map((dt) => dt.positionCode);

      dispatch({
        data: { currentPosition, currentRole, userData: profile },
        type: reducer.UPDATE_USER_DATA,
      });
    }
  }, [dataProfile]);


  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      console.log('state', state);
      const encryptedState = encrypt(JSON.stringify(state), ENCRYPT_KEY);
      localStorage.setItem(APP_CONTEXT_PERSIST, encryptedState);
    }
  }, [state]);

  // useEffect(() => {
  //   if (!token && pathname !== '/login') {
  //     router.replace('/login');
  //   }
  // }, [pathname]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export { AppDispatchContext, AppProvider, AppStateContext, appReducer };
