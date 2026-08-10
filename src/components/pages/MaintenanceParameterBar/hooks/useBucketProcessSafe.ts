import { useCallback, useRef, useState } from 'react';

import { checkExistingChangeRequest, registerBucket } from './constant';

import type {
  CheckExistingChangeRequestRequest,
  CheckExistingChangeRequestResponse,
  RegisterBucketRequest,
  RegisterBucketResponse,
} from './constant';


interface UseBucketProcessSafeReturn {
  bucketProcessId: string | null;
  isLoading: boolean;
  error: string | null;
  checkAndRegisterBucket: (module: string) => Promise<string | null>;
  checkExistingBucketOnly: (module: string) => Promise<string | null>;
  reset: () => void;
}

export const useBucketProcessSafe = (): UseBucketProcessSafeReturn => {
  const [bucketProcessId, setBucketProcessId] = useState<string | null>(null);
  const [bucketLoading, setBucketLoading] = useState<boolean>(false);
  const [bucketError, setBucketError] = useState<string | null>(null);

  // Prevent multiple simultaneous calls
  const isProcessing = useRef(false);

  const checkAndRegisterBucket = useCallback(async (
    module: string,
    onSuccess?: (bucketProcessId: string) => void
  ): Promise<string | null> => {

    // Prevent multiple simultaneous calls
    if (isProcessing.current) {
      return bucketProcessId;
    }

    isProcessing.current = true;
    setBucketLoading(true);
    setBucketError(null);

    try {
      // Step 1: Check existing change request
      // Use the module parameter passed from the calling component (subModule from bucket list)
      const checkRequest: CheckExistingChangeRequestRequest = { module };
      const checkResponse: CheckExistingChangeRequestResponse = await checkExistingChangeRequest(checkRequest);

      // Jika ada existing, gunakan bucketProcessId yang ada
      // Check multiple possible response structures
      const hasExistingData = checkResponse.hasExisting ||
                              checkResponse.bucketProcessId ||
                              (checkResponse as any).data?.hasExisting ||
                              (checkResponse as any).data?.bucketProcessId;

      const existingBucketProcessId = checkResponse.bucketProcessId ||
                                      (checkResponse as any).data?.bucketProcessId ||
                                      (checkResponse as any).bucketProcessId;

      if (hasExistingData && existingBucketProcessId) {
        setBucketProcessId(existingBucketProcessId);
        onSuccess?.(existingBucketProcessId);
        return existingBucketProcessId;
      }

      // Step 2: Jika tidak ada existing, lakukan registrasi
      const registerRequest: RegisterBucketRequest = {
        additionalData: module,
        debtorId: 'DEBT-SYSTEM',
        module: 'PARAMETER_BUSINESS_CALL',
        process: 'PARAMETER_BUSINESS_CALL',
      };

      const registerResponse: RegisterBucketResponse = await registerBucket(registerRequest);

      // Check multiple possible response structures for register
      const isSuccess = registerResponse.success ||
                       (registerResponse as any).data?.success ||
                       (registerResponse as any).success;

      const newBucketProcessId = registerResponse.bucketProcessId ||
                                 (registerResponse as any).data?.bucketProcessId ||
                                 (registerResponse as any).bucketProcessId;

      if (isSuccess && newBucketProcessId) {
        setBucketProcessId(newBucketProcessId);

        // Hit check existing again to get the latest bucketProcessId
        const recheckResponse: CheckExistingChangeRequestResponse = await checkExistingChangeRequest(checkRequest);
        const recheckBucketProcessId = recheckResponse.bucketProcessId ||
                                      (recheckResponse as any).data?.bucketProcessId ||
                                      (recheckResponse as any).bucketProcessId;

        if (recheckBucketProcessId) {
          setBucketProcessId(recheckBucketProcessId);
          onSuccess?.(recheckBucketProcessId);
          return recheckBucketProcessId;
        }

        onSuccess?.(newBucketProcessId);
        return newBucketProcessId;
      }

      throw new Error(registerResponse.message || 'Failed to register bucket');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setBucketError(errorMessage);
      return null;
    } finally {
      setBucketLoading(false);
      isProcessing.current = false;
    }
  }, [bucketProcessId, setBucketProcessId, setBucketLoading, setBucketError]);

  // For isChecker: Only check existing bucket process, don't create new one
  const checkExistingBucketOnly = useCallback(async (
    module: string,
    onSuccess?: (bucketProcessId: string) => void
  ): Promise<string | null> => {

    // Prevent multiple simultaneous calls
    if (isProcessing.current) {
      return bucketProcessId;
    }

    isProcessing.current = true;
    setBucketLoading(true);
    setBucketError(null);

    try {
      // Only check existing change request, don't register if not found
      const checkRequest: CheckExistingChangeRequestRequest = { module };
      const checkResponse: CheckExistingChangeRequestResponse = await checkExistingChangeRequest(checkRequest);

      // Check multiple possible response structures
      const hasExistingData = checkResponse.hasExisting ||
                              checkResponse.bucketProcessId ||
                              (checkResponse as any).data?.hasExisting ||
                              (checkResponse as any).data?.bucketProcessId;

      const existingBucketProcessId = checkResponse.bucketProcessId ||
                                      (checkResponse as any).data?.bucketProcessId ||
                                      (checkResponse as any).bucketProcessId;

      if (hasExistingData && existingBucketProcessId) {
        setBucketProcessId(existingBucketProcessId);
        onSuccess?.(existingBucketProcessId);
        return existingBucketProcessId;
      }

      // For isChecker, don't create new bucket if none exists
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setBucketError(errorMessage);
      return null;
    } finally {
      setBucketLoading(false);
      isProcessing.current = false;
    }
  }, [bucketProcessId, setBucketProcessId, setBucketLoading, setBucketError]);

  const reset = useCallback(() => {
    setBucketProcessId(null);
    setBucketError(null);
    setBucketLoading(false);
    isProcessing.current = false;
  }, [setBucketProcessId, setBucketError, setBucketLoading]);

  return {
    bucketProcessId,
    checkAndRegisterBucket,
    checkExistingBucketOnly,
    error: bucketError,
    isLoading: bucketLoading || false,
    reset,
  };
};
