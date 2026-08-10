'use client';
import { createContext, useState } from 'react';


const initialState = {};

export const MaintenanceTAT = createContext(undefined);

export const MaintenanceTATProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <MaintenanceTAT.Provider value={[state, setState]}>
      {children}
    </MaintenanceTAT.Provider>
  );
};
