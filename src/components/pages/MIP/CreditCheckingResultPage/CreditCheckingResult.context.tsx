'use client';
import { createContext, useState } from 'react';


export const CreditCheckingContext = createContext(undefined);

export const CreditCheckingProvider = ({ children }) => {
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  return (
    <CreditCheckingContext.Provider value={{ activeTab, setActiveTab, setShouldGoNext, shouldGoNext }}>
      {children}
    </CreditCheckingContext.Provider>
  );
};
