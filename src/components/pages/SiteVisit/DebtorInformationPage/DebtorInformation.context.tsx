import { createContext } from 'react';

import useDebtorInformation from './DebtorInformation.hook';


export const DebtorInformationContext = createContext(undefined);

export const DebtorInformationProvider = ({ children }) => {
  const {
    payload,
    changePayload,
    setPayload,
  } = useDebtorInformation();

  return (
    <DebtorInformationContext.Provider value={{ changePayload, payload, setPayload }}>
      {children}
    </DebtorInformationContext.Provider>
  );
};
