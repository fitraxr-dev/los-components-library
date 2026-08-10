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
  businessSummaryData?: any;
  bucketLoading?: boolean;
  bucketError?: string | null;
  code: string | null;
  isDetail: boolean;
  isEdit: boolean;
  isViewOnly: boolean;
  key: string;
  label: string | null;
  module: string;
  source?: string; // 'bucket-list' or 'approval-list'
  subModule: string | null;
}

interface NavigationContextType {
  navigationData: NavigationData;
  setNavigationData: (data: Partial<NavigationData>) => void;
  navigateToDetail: (data: any, isViewOnly?: boolean) => void;
  navigateToEdit: (data: any) => void;
  resetNavigation: () => void;
  setBusinessSummaryData: (data: any) => void;
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
        const stored = sessionStorage.getItem('maintenanceParameterVANavigation');
        if (stored) {
          const parsed = JSON.parse(stored);
          const result = {
            bucketProcessId: null,
            code: null,
            isDetail: false,
            isEdit: false,
            isViewOnly: false,
            key: '',
            label: null,
            module: 'parameter-va',
            subModule: null,
            ...parsed,
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
      code: null,
      isDetail: false,
      isEdit: false,
      isViewOnly: false,
      key: '',
      label: null,
      module: 'parameter-va',
      subModule: null,
      ...initialData,
    };
    return defaultData;
  };

  const [navigationData, setNavigationDataState] = useState<NavigationData>(getInitialData);

  const setNavigationData = useCallback((newData: Partial<NavigationData>) => {
    console.log('=== NAVIGATION CONTEXT SET DATA DEBUG ===');
    console.log('New data being set:', newData);
    console.log('Previous data:', navigationData);

    setNavigationDataState((prevData) => {
      const updatedData = {
        ...prevData,
        ...newData,
      };

      console.log('Updated data:', updatedData);

      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('maintenanceParameterVANavigation', JSON.stringify(updatedData));
          console.log('Saved to sessionStorage successfully');
        } catch (error) {
          console.warn('Failed to save navigation data to sessionStorage:', error);
        }
      }

      return updatedData;
    });
  }, [navigationData]);

  const navigateToDetail = useCallback((data: any, isViewOnly: boolean = true) => {

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maintenanceParameterVANavigation');
    }

    setNavigationData({
      bucketProcessId: data.bucketProcessId || null,
      code: data.code || null,
      isDetail: true,
      isEdit: false,
      isViewOnly,
      key: data.code || '',
      label: data.module || null,
      module: 'parameter-va',
      source: data.source || null,
      subModule: data.subModule || null,
    });
  }, [setNavigationData]);

  const navigateToEdit = useCallback((data: any) => {
    setNavigationData({
      bucketProcessId: data.bucketProcessId || null,
      code: data.code || null,
      isDetail: true,
      isEdit: true,
      isViewOnly: false,
      key: data.code || '',
      label: data.module || null,
      module: 'parameter-va',
      source: data.source || null,
      subModule: data.subModule || null,
    });
  }, [setNavigationData]);

  const resetNavigation = useCallback(() => {
    const resetData = {
      bucketProcessId: null,
      businessSummaryData: null,
      code: null,
      isDetail: false,
      isEdit: false,
      isViewOnly: false,
      key: '',
      label: null,
      module: 'parameter-va',
      subModule: null,
    };

    setNavigationDataState(resetData);

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('maintenanceParameterVANavigation');
      } catch (error) {
        console.warn('Failed to clear navigation data from sessionStorage:', error);
      }
    }
  }, []);

  const setBusinessSummaryData = useCallback((data: any) => {
    setNavigationDataState((prevData) => {
      const updatedData = {
        ...prevData,
        businessSummaryData: data,
      };

      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('maintenanceParameterVANavigation', JSON.stringify(updatedData));
        } catch (error) {
          console.warn('Failed to save business summary data to sessionStorage:', error);
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
          sessionStorage.setItem('maintenanceParameterVANavigation', JSON.stringify(updatedData));
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
          sessionStorage.setItem('maintenanceParameterVANavigation', JSON.stringify(updatedData));
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
          sessionStorage.setItem('maintenanceParameterVANavigation', JSON.stringify(updatedData));
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
    setBusinessSummaryData,
    setNavigationData,
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
