import React, { createContext } from 'react';


import type { DebtorInformationDataRequestDto } from '@/services/openapi/bucket-service';
import type { Dispatch, ReactNode } from 'react';


export const ShareholdingStructureContext = createContext(undefined);

type DebtorInformationProps = {
  children: ReactNode;
  value: {
    payload: DebtorInformationDataRequestDto;
    changePayload: any;
    setPayload: Dispatch<DebtorInformationDataRequestDto>;};
}

export const ShareholdingStructureProvider = ({
  children,
  value,
}): any => {
  return (
    <ShareholdingStructureContext.Provider value={value}>
      {children}
    </ShareholdingStructureContext.Provider>
  );
};
