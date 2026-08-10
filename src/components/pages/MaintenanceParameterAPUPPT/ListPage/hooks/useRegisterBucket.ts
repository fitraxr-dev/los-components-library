import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface RegisterBucketRequest {
  id: string;
}

interface RegisterBucketResponse {
  operationId?: string | null;
  errorCode?: string;
  errorDesc?: string;
  errorSource?: string;
  errorDetail?: string | null;
  timestamp?: string;
  data?: {
    content?: {
      module?: string;
      process?: string;
      debtorId?: string;
      bucketMasterId?: string;
      bucketProcessId?: string;
      additionalData?: string;
    };
  };
  // Allow for different response structures
  [key: string]: any;
}

const useRegisterBucket = (
  options?: Partial<UseMutationOptions<RegisterBucketResponse, Error, RegisterBucketRequest>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: RegisterBucketRequest) => {
      try {
        const response = await API('parameter.parameterApuPpt.registerBucket', { data: payload });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useRegisterBucket;
