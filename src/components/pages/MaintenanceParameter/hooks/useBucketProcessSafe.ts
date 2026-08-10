import React, { useCallback, useRef, useState } from 'react';

import { registerWorkflow } from './constant/registerWorkflow';

import type { RegisterWorkflowRequest, RegisterWorkflowResponse } from './constant/registerWorkflow';


interface UseBucketProcessSafeReturn {
  bucketProcessId: string | null;
  registerData: any | null;
  isLoading: boolean;
  error: string | null;
  registerWorkflowBucket: (id: number) => Promise<string | null>;
  reset: () => void;
}

export const useBucketProcessSafe = (): UseBucketProcessSafeReturn => {
  const [bucketProcessId, setBucketProcessId] = useState<string | null>(null);
  const [registerData, setRegisterData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Read from sessionStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('maintenanceParameterNavigation');
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          if (parsedData.bucketProcessId && !bucketProcessId) {
            setBucketProcessId(parsedData.bucketProcessId);
          }
          if (parsedData.registerData && !registerData) {
            setRegisterData(parsedData.registerData);
          }
        } catch (error) {
          console.warn('Failed to parse navigation data:', error);
        }
      }
    }
  }, [bucketProcessId, registerData]);


  // Prevent multiple simultaneous calls
  const isProcessing = useRef(false);

  const registerWorkflowBucket = useCallback(async (id: number): Promise<string | null> => {
    // Prevent multiple simultaneous calls
    if (isProcessing.current) {
      return bucketProcessId;
    }

    isProcessing.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Register workflow for edit mode
      const registerRequest: RegisterWorkflowRequest = {
        id: id,
      };

      const registerResponse: RegisterWorkflowResponse = await registerWorkflow(registerRequest);

      // Check response structure
      const isSuccess = registerResponse.errorCode === '0000' ||
                       registerResponse.data?.id;

      if (isSuccess && registerResponse.data) {
        const newBucketProcessId = registerResponse.data.bucketProcessId;

        if (newBucketProcessId) {
          setBucketProcessId(newBucketProcessId);
          setRegisterData(registerResponse.data);

          // Store in sessionStorage for navigation
          const navigationData = {
            bucketProcessId: newBucketProcessId,
            id: id,
            isEdit: true,
            isViewOnly: false,
            key: registerResponse.data.parameterName || '',
            registerData: registerResponse.data,
          };

          sessionStorage.setItem('maintenanceParameterNavigation', JSON.stringify(navigationData));

          return newBucketProcessId;
        }
      }

      throw new Error(registerResponse.errorDesc || 'Failed to register workflow');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
      isProcessing.current = false;
    }
  }, [bucketProcessId]);

  const reset = useCallback(() => {
    setBucketProcessId(null);
    setRegisterData(null);
    setError(null);
    setIsLoading(false);
    isProcessing.current = false;
  }, []);

  return {
    bucketProcessId,
    error,
    isLoading,
    registerData,
    registerWorkflowBucket,
    reset,
  };
};
