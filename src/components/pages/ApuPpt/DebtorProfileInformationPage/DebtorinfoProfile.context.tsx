import React, { createContext } from 'react';


import type { DebtorInformationDataRequestDto } from '@/services/openapi/bucket-service';
import type { Dispatch, ReactNode } from 'react';


export const DebtorInformationProfileContext = createContext(undefined);

type DebtorInformationProps = {
  children: ReactNode;
  value: {
    payload: DebtorInformationDataRequestDto;
    changePayload: any;
    setPayload: Dispatch<DebtorInformationDataRequestDto>;};
}

export const DebtorInformationProfileProvider = ({
  children,
  value,
}): any => {
  return (
    <DebtorInformationProfileContext.Provider value={value}>
      {children}
    </DebtorInformationProfileContext.Provider>
  );
};
