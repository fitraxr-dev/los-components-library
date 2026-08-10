import { createContext, useContext, useState } from 'react';


const initialState = {
  activeTab: '',
};

export const BmppSimulationContext = createContext(undefined);

export const BmppSimulationProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <BmppSimulationContext.Provider value={[setState, state]}>
      {children}
    </BmppSimulationContext.Provider>
  );
};

export const useBmppSimulationContext = () => {
  const [state, setState] = useContext(BmppSimulationContext);

  return {
    setState,
    state,
  };
};
