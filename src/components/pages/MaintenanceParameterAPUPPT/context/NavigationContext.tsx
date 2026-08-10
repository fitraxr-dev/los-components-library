'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

import type { ReactNode } from 'react';


export interface NavigationData {
  bucketProcessId: string | null;
  parameterData?: any;
  bucketLoading?: boolean;
  bucketError?: string | null;
  id: string | null;
  isDetail: boolean;
  isEdit: boolean;
  isViewOnly: boolean;
  key: string;
  label: string | null;
  module: string;
  source?: string; // 'bucket-list' or 'approval-list'
  subModule: string | null;
  // Register workflow data
  registerId?: string | null;
  registerData?: any;
  // Row data fields
  groupName?: string | null;
  modifiedBy?: string | null;
  modifiedDate?: string | null;
  isEditable?: boolean;
  // Flag to indicate if this is a detail view from bucket-list (should disable summary and validation steps)
  isBucketListDetail?: boolean;
  // Allow any additional fields
  [key: string]: any;
}

interface NavigationContextType {
  navigationData: NavigationData;
  setNavigationData: (data: Partial<NavigationData>) => void;
  navigateToDetail: (data: any, isViewOnly?: boolean) => void;
  navigateToEdit: (data: any) => void;
  resetNavigation: () => void;
  setParameterData: (data: any) => void;
  setBucketProcessId: (bucketProcessId: string | null) => void;
  setBucketLoading: (loading: boolean) => void;
  setBucketError: (error: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  initialData?: Partial<NavigationData>;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  initialData = {},
}) => {

  const getInitialData = (): NavigationData => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('maintenanceParameterAPUPPTNavigation');
        if (stored) {
          const parsed = JSON.parse(stored);
          const result = {
            bucketProcessId: null,
            id: null,
            isBucketListDetail: false,
            isDetail: false,
            isEdit: false,
            isViewOnly: false,
            key: '',
            label: null,
            module: 'parameter-mapping-apu-ppt',
            subModule: null,
            ...parsed, // This should come before the defaults to preserve existing values
            ...initialData,
          };
          return result;
        }
      } catch (error) {
        console.warn('Failed to parse stored navigation data:', error);
      }
    }

    const defaultData = {
      bucketProcessId: null,
      id: null,
      isBucketListDetail: false,
      isDetail: false,
      isEdit: false,
      isViewOnly: false,
      key: '',
      label: null,
      module: 'parameter-mapping-apu-ppt',
      subModule: null,
      ...initialData,
    };
    return defaultData;
  };

  const [navigationData, setNavigationDataState] = useState<NavigationData>(getInitialData);

  const setNavigationData = useCallback((newData: Partial<NavigationData>) => {
    setNavigationDataState((prevData) => {
      const updatedData = {
        ...prevData,
        ...newData,
      };

      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('maintenanceParameterAPUPPTNavigation', JSON.stringify(updatedData));
        } catch (error) {
          console.warn('Failed to save navigation data to sessionStorage:', error);
        }
      }

      return updatedData;
    });
  }, []);

  const navigateToDetail = useCallback((data: any, isViewOnly: boolean = true) => {

    // Don't remove sessionStorage, just update the data
    const newNavigationData = {
      ...data, // Spread all row data first
      bucketProcessId: data.bucketProcessId || null,
      id: data.id || null,
      // Set flag to indicate if this is a detail view from bucket-list
      isBucketListDetail: data.source === 'bucket-list' && isViewOnly,

      isDetail: true,

      isEdit: false,

      isViewOnly,

      key: data.id || '',

      label: data.groupName || null,

      module: 'parameter-mapping-apu-ppt',

      source: data.source || null,

      subModule: data.subModule || null,
    };

    setNavigationData(newNavigationData);
  }, [setNavigationData]);

  const navigateToEdit = useCallback((data: any) => {
    setNavigationData({
      ...data, // Spread all row data first
      bucketProcessId: data.bucketProcessId || null,
      id: data.id || null,
      isDetail: true,
      isEdit: true,
      isViewOnly: false,
      key: data.id || '',
      label: data.groupName || null,
      module: 'parameter-mapping-apu-ppt',
      source: data.source || null,
      subModule: data.subModule || null,
    });
  }, [setNavigationData]);

  const resetNavigation = useCallback(() => {
    const resetData = {
      bucketProcessId: null,
      id: null,
      isBucketListDetail: false,
      isDetail: false,
      isEdit: false,
      isViewOnly: false,
      key: '',
      label: null,
      module: 'parameter-mapping-apu-ppt',
      parameterData: null,
      subModule: null,
    };

    setNavigationDataState(resetData);

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('maintenanceParameterAPUPPTNavigation');
      } catch (error) {
        console.warn('Failed to clear navigation data from sessionStorage:', error);
      }
    }
  }, []);

  const setParameterData = useCallback((data: any) => {
    setNavigationDataState((prevData) => {
      const updatedData = {
        ...prevData,
        parameterData: data,
      };

      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('maintenanceParameterAPUPPTNavigation', JSON.stringify(updatedData));
        } catch (error) {
          console.warn('Failed to save parameter data to sessionStorage:', error);
        }
      }

      return updatedData;
    });
  }, []);

  const setBucketProcessId = useCallback((bucketProcessId: string | null) => {
    setNavigationDataState((prevData) => {
      const updatedData = {
        ...prevData,
        bucketProcessId,
      };

      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('maintenanceParameterAPUPPTNavigation', JSON.stringify(updatedData));
        } catch (error) {
          console.warn('Failed to save bucket process ID to sessionStorage:', error);
        }
      }

      return updatedData;
    });
  }, []);

  const setBucketLoading = useCallback((bucketLoading: boolean) => {
    setNavigationDataState((prevData) => {
      const updatedData = {
        ...prevData,
        bucketLoading,
      };

      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('maintenanceParameterAPUPPTNavigation', JSON.stringify(updatedData));
        } catch (error) {
          console.warn('Failed to save bucket loading state to sessionStorage:', error);
        }
      }

      return updatedData;
    });
  }, []);

  const setBucketError = useCallback((bucketError: string | null) => {
    setNavigationDataState((prevData) => {
      const updatedData = {
        ...prevData,
        bucketError,
      };

      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('maintenanceParameterAPUPPTNavigation', JSON.stringify(updatedData));
        } catch (error) {
          console.warn('Failed to save bucket error to sessionStorage:', error);
        }
      }

      return updatedData;
    });
  }, []);

  const contextValue: NavigationContextType = {
    navigateToDetail,
    navigateToEdit,
    navigationData,
    resetNavigation,
    setBucketError,
    setBucketLoading,
    setBucketProcessId,
    setNavigationData,
    setParameterData,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};
