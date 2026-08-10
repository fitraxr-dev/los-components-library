import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';

import type { ReactNode } from 'react';


interface OverlayState {
  url: string;
  isOpen: boolean;
  type: AllowedOverlayTypes;
}

interface OverlayContextApi {
  setUrl: React.Dispatch<React.SetStateAction<String>>;
  setIsOpen: React.Dispatch<React.SetStateAction<Boolean>>;
  setType: React.Dispatch<React.SetStateAction<AllowedOverlayTypes>>;
  setOverlay: (url: string, type: AllowedOverlayTypes, isOpen: boolean) => void;
}

const OverlayContext = createContext<OverlayState | undefined>(undefined);
const OverlayApiContext = createContext<OverlayContextApi | undefined>(undefined);

export type AllowedOverlayTypes = 'pdf' | 'image' | undefined;

export const OverlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState<AllowedOverlayTypes>();
  const [isOpen, setIsOpen] = useState(false);
  const setOverlay = useCallback((url: string, type: AllowedOverlayTypes, isOpen: boolean) => {
    setUrl(url);
    setType(type);
    setIsOpen(isOpen);
  }, []);

  useMemo(() => {
    if (isOpen === false) {
      setType(undefined);
      setUrl('');
    }
  }, [isOpen]);

  return (
    <OverlayContext.Provider value={{ isOpen, type, url }}>
      <OverlayApiContext.Provider value={{ setIsOpen, setOverlay, setType, setUrl }}>
        {children}
      </OverlayApiContext.Provider>
    </OverlayContext.Provider>
  );
};

export const useOverlayContext = (): OverlayState => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlayContext must be used within an OverlayProvider');
  }
  return context;
};

export const useOverlayApiContext = (): OverlayContextApi => {
  const context = useContext(OverlayApiContext);
  if (!context) {
    throw new Error('useOverlayContext must be used within an OverlayProvider');
  }
  return context;
};
