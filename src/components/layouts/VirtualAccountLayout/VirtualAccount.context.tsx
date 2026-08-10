'use client';
import {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from 'react';

import { useParams, usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { accessid } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';


interface VirtualAccountContextState {
  currentRole: string[];
  isStaff: boolean;
  isTL: boolean;
  isKadiv: boolean;
  isStaffDkhi: boolean;
  isSuperAdmin: boolean;
  isMaker: boolean;
  isChecker: boolean;
  isTaskForce: boolean;
  currentDivision: string;
}

const initialState: VirtualAccountContextState = {
  currentDivision: '',
  currentRole: [],
  isChecker: false,
  isKadiv: false,
  isMaker: false,
  isStaff: false,
  isStaffDkhi: false,
  isSuperAdmin: false,
  isTL: false,
  isTaskForce: false,
};

export const VirtualAccount = createContext<VirtualAccountContextState>(initialState);

export const VirtualAccountProvider = ({ children }) => {
  const [{ currentRole, stepper, currentPosition, userData }] = useApp();
  const params = useParams();
  const pathname = usePathname();
  const canEditVa = useCheckAccess(accessid.VIRTUAL_ACCOUNT_UPDATE);
  const canEditVaActivation = useCheckAccess(accessid.VIRTUAL_ACCOUNT_ACTIVATION_UPDATE);
  const canCreateVa = useCheckAccess(accessid.VIRTUAL_ACCOUNT_CREATE);
  const canCreateVaActivation = useCheckAccess(accessid.VIRTUAL_ACCOUNT_ACTIVATION_CREATE);
  const canDeleteVa = useCheckAccess(accessid.VIRTUAL_ACCOUNT_DELETE);
  const canDeleteVaActivation = useCheckAccess(accessid.VIRTUAL_ACCOUNT_ACTIVATION_DELETE);
  const canViewVa = useCheckAccess(accessid.VIRTUAL_ACCOUNT_VIEW);
  const canViewVaActivation = useCheckAccess(accessid.VIRTUAL_ACCOUNT_ACTIVATION_VIEW);
  const isMaker = currentRole.includes('MAKER');
  const isChecker = currentRole.includes('CHECKER');
  const isTaskForce = currentPosition.includes('TASK_FORCE');

  const division = userData?.userDivision?.divisionCode;

  const isStaff = useMemo(() => currentRole.includes(roles.STAFF), [currentRole]);
  const isTL = useMemo(() => currentRole.includes(roles.TL), [currentRole]);
  const isKadiv = useMemo(() => currentRole.includes(roles.KADIV), [currentRole]);
  const isSuperAdmin = useMemo(() => currentPosition.includes('SUPER_ADMIN'), [currentPosition]);
  const isStaffDkhi = useMemo(() => division === 'DKHI_DIVISION', [division]);
  // useEffect(() => {console.log('division', isSuperAdmin);
  // }, [isSuperAdmin]);
  const contextValue = useMemo(
    () => ({
      currentDivision: division,
      currentRole,
      isChecker,
      isKadiv,
      isMaker,
      isStaff,
      isStaffDkhi,
      isSuperAdmin,
      isTL,
      isTaskForce,
    }),
    [currentRole, isStaff, isTL, isKadiv, isSuperAdmin, isStaffDkhi, isMaker, isChecker, division, isTaskForce]
  );

  return (
    <VirtualAccount.Provider value={contextValue}>
      {children}
    </VirtualAccount.Provider>
  );
};

export const useVirtualAccountContext = () => {
  const context = useContext(VirtualAccount);
  if (context === undefined) {
    throw new Error('useVirtualAccountContext must be used within a VirtualAccountProvider');
  }
  return context;
};
