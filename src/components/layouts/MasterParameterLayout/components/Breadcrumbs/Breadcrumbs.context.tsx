'use client';
import React from 'react';


export type Crumb = { label: string; href?: string | null };
type BreadcrumbsState = Crumb[];

type BreadcrumbsContextValue = {
  items: BreadcrumbsState;
  set: React.Dispatch<React.SetStateAction<BreadcrumbsState>>;
  push: (crumb: Crumb) => void;
  replaceLast: (crumb: Crumb) => void;
  reset: (items?: BreadcrumbsState) => void;
};

const BreadcrumbsContext = React.createContext<BreadcrumbsContextValue | undefined>(undefined);

export function useBreadcrumbs(): BreadcrumbsContextValue {
  const ctx = React.useContext(BreadcrumbsContext);
  if (!ctx) throw new Error('useBreadcrumbs must be used within <BreadcrumbsProvider>');
  return ctx;
}

type ProviderProps = {
  initialItems?: BreadcrumbsState;
  children: React.ReactNode;
};

export const BreadcrumbsProvider = ({ initialItems = null, children }: ProviderProps) => {
  const [items, setItems] = React.useState<BreadcrumbsState>(initialItems);

  const push = React.useCallback((crumb: Crumb) => {
    setItems((prev) => [...prev, crumb]);
  }, []);

  const replaceLast = React.useCallback((crumb: Crumb) => {
    setItems((prev) => (prev.length ? [...prev.slice(0, -1), crumb] : [crumb]));
  }, []);

  const reset = React.useCallback((next?: BreadcrumbsState) => {
    setItems(next ?? initialItems);
  }, []);

  const value = React.useMemo(
    () => ({ items, push, replaceLast, reset, set: setItems }),
    [items, push, replaceLast, reset]
  );

  return <BreadcrumbsContext.Provider value={value}>{children}</BreadcrumbsContext.Provider>;
};
