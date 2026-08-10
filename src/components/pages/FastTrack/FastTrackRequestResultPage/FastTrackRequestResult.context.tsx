import * as React from 'react';


type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export type FastTrackRequestResultCtx = {
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

const FastTrackResultContext = React.createContext<FastTrackRequestResultCtx | null>(null);

export const useFastTrackRequestResultContext = (): FastTrackRequestResultCtx => {
  const ctx = React.useContext(FastTrackResultContext);
  if (!ctx) throw new Error('useFastTrackRequestResultContext must be used within <FastTrackRequestResultProvider />');
  return ctx;
};

interface FastTrackRequestResultProviderProps {
  value: FastTrackRequestResultCtx;
  children: React.ReactNode;
};

const FastTrackRequestResultProvider = ({ value, children }: FastTrackRequestResultProviderProps) => {
  const memo = React.useMemo(() => value, [value]);

  return (
    <FastTrackResultContext.Provider value={memo}>
      {children}
    </FastTrackResultContext.Provider>
  );
};
export default FastTrackRequestResultProvider;
