import { useContext } from 'react';

import { AppDispatchContext, AppStateContext } from '@/components/layouts/AppLayout/App.context';

import type { AppState } from '@/types/App';


/**
 * Custom React hook for accessing App Context.
 *
 * This hook is a convenience function that combines the `useAppState` and
 * `useAppDispatch` hooks to provide both the application state and dispatch
 * function in a single call.
 *
 * @returns {[AppState , dispatchAppState]} An array containing the application state and dispatch function.
 */
const useApp = (): [AppState, any] => {
  return [useAppState(), useAppDispatch()];
};

const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) throw new Error('useAppState must be used within a AppProvider');
  return context;
};

const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) throw new Error('useAppDispatch must be used within a AppProvider');
  return context;
};

export default useApp;
