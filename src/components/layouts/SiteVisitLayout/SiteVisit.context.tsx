'use client';
import { createContext, useState } from 'react';

import type {
  BaseResponseGenericSingleDtoBucketResponseDto,
  BucketResponseDto,
} from '@/services/openapi/bucket-service';
import type { Dispatch, SetStateAction } from 'react';


const initialState: SiteVisitContextState = {
  existingDebtorId: null,
  isExistingDebtor: false,
  percentage: 0,
  siteVisitBucketDetail: undefined,
  siteVisitDetail: undefined,
};

export const SiteVisitContex = createContext<SiteVisitContextType>(undefined);

export const SiteVisitProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <SiteVisitContex.Provider value={{ setState, state }}>
      {children}
    </SiteVisitContex.Provider>
  );
};

export type SiteVisitContextState = {
  isExistingDebtor: boolean;
  existingDebtorId: string | null;
  percentage: number;
  siteVisitDetail: {
    bucketId: string;
    bucketMasterId?: string;
    bucketProcessId?: string;
    masterDebtor?: BaseResponseGenericSingleDtoBucketResponseDto | {};
    id: string;
    visitCode?: string;
    isFromHistory?: boolean;
    isRefina?: boolean;
    module?: string;
    process?: string;
    visitDetailData?: any;
  } | undefined;
  siteVisitBucketDetail: BucketResponseDto | undefined;
}

export type SiteVisitContextType = {
  state: SiteVisitContextState;
  setState: Dispatch<SetStateAction<SiteVisitContextState>>;
}
