'use client';

import { createContext, useContext, useState } from 'react';


interface ReportState {
  activeTab: string;
}

type ReportContextType = [
  ReportState,
  React.Dispatch<React.SetStateAction<ReportState>>
];

const initialState: ReportState = {
  activeTab: 'list-data',
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ReportState>(initialState);

  return (
    <ReportContext.Provider value={[state, setState]}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error(
      'useReportContext must be used within a ReportProvider'
    );
  }
  return context;
};
