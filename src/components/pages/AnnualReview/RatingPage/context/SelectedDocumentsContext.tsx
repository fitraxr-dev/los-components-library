import React, { createContext, useContext, useState } from 'react';

import type { ReactNode } from 'react';


interface SelectedDocument {
  id: number;
  documentName: string;
}

interface SelectedDocumentsContextType {
  selectedDocuments: SelectedDocument[];
  setSelectedDocuments: (documents: SelectedDocument[]) => void;
  handleSelectDocument: (data: SelectedDocument) => void;
  resetSelectedDocuments: () => void;
}

const SelectedDocumentsContext = createContext<SelectedDocumentsContextType | undefined>(undefined);

export const SelectedDocumentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocument[]>([]);

  const handleSelectDocument = (data: SelectedDocument) => {
    setSelectedDocuments((prev) => {
      if (prev.some((item) => item.id === data.id)) {
        return prev.filter((item) => item.id !== data.id);
      } else {
        return [...prev, {
          documentName: data.documentName,
          id: data.id,
        }];
      }
    });
  };

  const resetSelectedDocuments = () => {
    setSelectedDocuments([]);
  };

  return (
    <SelectedDocumentsContext.Provider
      value={{
        handleSelectDocument,
        resetSelectedDocuments,
        selectedDocuments,
        setSelectedDocuments,
      }}
    >
      {children}
    </SelectedDocumentsContext.Provider>
  );
};

export const useSelectedDocuments = () => {
  const context = useContext(SelectedDocumentsContext);
  if (context === undefined) {
    throw new Error('useSelectedDocuments must be used within a SelectedDocumentsProvider');
  }
  return context;
};
