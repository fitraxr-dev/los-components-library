import { useContext } from 'react';

import { SiteVisitContex } from '@/components/layouts/SiteVisitLayout/SiteVisit.context';

import type { SiteVisitContextState } from '@/components/layouts/SiteVisitLayout/SiteVisit.context';
import type { SetStateAction } from 'react';


const useSiteVisitContext = () => {
  const { state, setState } = useContext(SiteVisitContex);

  const updateState = (update: Partial<SetStateAction<SiteVisitContextState>>) => {
    setState({ ...state, ...update });
  };

  return { ...state, updateState };
};

export default useSiteVisitContext;
