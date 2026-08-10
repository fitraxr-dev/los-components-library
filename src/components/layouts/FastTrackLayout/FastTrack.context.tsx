'use client';

import * as React from 'react';

import { usePathname } from 'next/navigation';

import { DPOP_DIVISION } from '@/configs/constants';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';


type FastTrackState = {
  activeTab: number;
  tableType: string;
};

type FastTrackContextValue = readonly [
  FastTrackState,
  React.Dispatch<React.SetStateAction<FastTrackState>>
];

const STORAGE_KEY = (pid?: string | null) => `cc:tableType:${pid ?? 'global'}`;

export const FastTrackContext = React.createContext<FastTrackContextValue | null>(null);

export const FastTrackProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = React.useState<FastTrackState>({ activeTab: 0, tableType: '' });

  return (
    <FastTrackContext.Provider value={[state, setState]}>
      {children}
    </FastTrackContext.Provider>
  );
};

export const useFastTrackContext = () => {
  const ctx = React.useContext(FastTrackContext);
  if (!ctx) throw new Error('useFastTrackContext must be used within <FastTrackProvider>');
  const [state, setState] = ctx;

  const [appState] = useApp();
  const pathname = usePathname() ?? '';
  const { divisionCode } = useDivision();
  const { processId } = useIdentity();

  const steps = appState?.stepper?.steps ?? [];
  const lastPath = React.useMemo(() => getLastPath(pathname), [pathname]);

  const isRequestModule = React.useMemo(() => pathname.split('/').includes('request'), [pathname]);
  const isFastTrackPosition = Boolean(appState?.currentPosition?.includes('CC'));
  const isDpop = Boolean(divisionCode?.includes(DPOP_DIVISION));
  const filterStatusFastTrack = isDpop ? 'filterStatusFastTrackDpop' : 'filterStatusFastTrack';
  const isStaff = Boolean(appState?.currentRole?.includes('STAFF'));
  const isTL = Boolean(appState?.currentRole?.includes('TL'));
  const isKadiv = Boolean(appState?.currentRole?.includes('KADIV'));
  const isStaffCCDpop = isStaff && isFastTrackPosition && isDpop;

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
    filterStatusFastTrack,
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
