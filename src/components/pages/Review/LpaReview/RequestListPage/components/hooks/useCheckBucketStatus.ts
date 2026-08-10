import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface CheckBucketStatusPayload {
  debtorId: string;
  module: string;
  process: string;
}

interface CheckBucketStatusResponse {
  content: {
    status: string;
    statusLabel: string;
    bucketProcessId: string;
  };
}

interface UseCheckBucketStatusOptions {
  onSuccess?: (data: CheckBucketStatusResponse) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: CheckBucketStatusResponse | undefined, error: Error | null) => void;
}

const useCheckBucketStatus = (
  options?: UseCheckBucketStatusOptions &
  Partial<UseMutationOptions<CheckBucketStatusResponse, Error, CheckBucketStatusPayload>>
) => {
  const {
    onSuccess,
    onError,
    onSettled,
    ...mutationOptions
  } = options || {};

  const mutation = useMutation({
    mutationFn: async (payload: CheckBucketStatusPayload) => {
      const response = await API('lpa.bucket.statusCheck', {
        data: payload,
      });
      return response.data;
    },
    onError,
    onSettled,
    onSuccess,
    ...mutationOptions,
  });

  return mutation;
};

export default useCheckBucketStatus;
