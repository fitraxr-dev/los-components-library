'use client';

import * as React from 'react';

import { usePathname } from 'next/navigation';

import { DPOP_DIVISION } from '@/configs/constants';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';


type CreditCheckingState = {
  activeTab: number;
  tableType: string;
};

type CreditCheckingContextValue = readonly [
  CreditCheckingState,
  React.Dispatch<React.SetStateAction<CreditCheckingState>>
];

const STORAGE_KEY = (pid?: string | null) => `cc:tableType:${pid ?? 'global'}`;

export const CreditCheckingContext = React.createContext<CreditCheckingContextValue | null>(null);

export const CreditCheckingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = React.useState<CreditCheckingState>({ activeTab: 0, tableType: '' });

  return (
    <CreditCheckingContext.Provider value={[state, setState]}>
      {children}
    </CreditCheckingContext.Provider>
  );
};

export const useCreditCheckingContext = () => {
  const ctx = React.useContext(CreditCheckingContext);
  if (!ctx) throw new Error('useCreditCheckingContext must be used within <CreditCheckingProvider>');
  const [state, setState] = ctx;

  const [appState] = useApp();
  const pathname = usePathname() ?? '';
  const { divisionCode } = useDivision();
  const { processId } = useIdentity();

  const steps = appState?.stepper?.steps ?? [];
  const lastPath = React.useMemo(() => getLastPath(pathname), [pathname]);

  const isRequestModule = React.useMemo(() => pathname.split('/').includes('request'), [pathname]);
  const isCreditCheckingPosition = Boolean(appState?.currentPosition?.includes('CC'));
  const isDpop = Boolean(divisionCode?.includes(DPOP_DIVISION));
  const filterStatusCreditChecking = isDpop ? 'filterStatusCreditCheckingDpop' : 'filterStatusCreditChecking';
  const isStaff = Boolean(appState?.currentRole?.includes('STAFF'));
  const isTL = Boolean(appState?.currentRole?.includes('TL'));
  const isKadiv = Boolean(appState?.currentRole?.includes('KADIV'));
  const isStaffCCDpop = isStaff && isCreditCheckingPosition && isDpop;

  const actions = React.useMemo(
    () => steps.find((s) => s.urlPath === lastPath)?.action ?? {},
    [steps, lastPath]
  );

  const stepsTableType = React.useMemo(() => {
    const tt = steps.find((s) => s.urlPath === lastPath)?.action?.TABLE_TYPE;
    return typeof tt === 'string' && tt.trim() ? tt : '';
  }, [steps, lastPath]);

  React.useEffect(() => {
    let next = stepsTableType;
    if (!next && typeof window !== 'undefined') {
      next = sessionStorage.getItem(STORAGE_KEY(processId)) || '';
    }
    if (next && next !== state.tableType) {
      setState((prev) => ({ ...prev, tableType: next }));
    }
  }, [stepsTableType, processId]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!state.tableType) return;
    sessionStorage.setItem(STORAGE_KEY(processId), state.tableType);
  }, [state.tableType, processId]);

  const setActiveTab = React.useCallback((tab: number) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, [setState]);

  return {
    actions,
    activeTab: state.activeTab,
    filterStatusCreditChecking,
    isDpop,
    isKadiv,
    isRequestModule,
    isStaff,
    isStaffCCDpop,
    isTL,
    setActiveTab,
    stepper: appState?.stepper,
    tableType: state.tableType,
  };
};
