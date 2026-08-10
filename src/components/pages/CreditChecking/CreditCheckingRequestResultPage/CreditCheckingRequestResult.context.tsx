import * as React from 'react';


type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export type CreditCheckingRequestResultCtx = {
  form: any;
  setField: (field: string, value: unknown) => void;
  setMultiField?: (...args: any[]) => void;
  bucketDetail: any;
  selectedDebtor: any[];
  selectedShareholder: any[];
  selectedManagement: any[];
  selectedOtherRelation: any[];
  setSelectedDebtor: Setter<any[]>;
  setSelectedShareholder: Setter<any[]>;
  setSelectedManagement: Setter<any[]>;
  setSelectedOtherRelation: Setter<any[]>;
  hasInitializedSelection: {
    debtor: boolean;
    shareholder: boolean;
    management: boolean;
    otherRelation: boolean;
  };
  initializeTableSelection: (tableType: string, data: any[]) => void;
};

const CreditCheckingResultContext = React.createContext<CreditCheckingRequestResultCtx | null>(null);

export const useCreditCheckingRequestResultContext = (): CreditCheckingRequestResultCtx => {
  const ctx = React.useContext(CreditCheckingResultContext);
  if (!ctx) throw new Error('useCreditCheckingRequestResultContext must be used within <CreditCheckingRequestResultProvider />');
  return ctx;
};

interface CreditCheckingRequestResultProviderProps {
  value: CreditCheckingRequestResultCtx;
  children: React.ReactNode;
};

const CreditCheckingRequestResultProvider = ({ value, children }: CreditCheckingRequestResultProviderProps) => {
  const memo = React.useMemo(() => value, [value]);

  return (
    <CreditCheckingResultContext.Provider value={memo}>
      {children}
    </CreditCheckingResultContext.Provider>
  );
};
export default CreditCheckingRequestResultProvider;
