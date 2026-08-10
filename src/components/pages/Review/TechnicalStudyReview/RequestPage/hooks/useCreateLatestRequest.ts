import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface CreateLatestRequestPayload {
  latestBucketProcessId: string;
  newBucketProcessId: string;
  status: string;
  module: string;
  process: string;
}

interface CreateLatestRequestResponse {
  content: {
    success: boolean;
    message?: string;
  };
}

interface UseCreateLatestRequestOptions {
  onSuccess?: (data: CreateLatestRequestResponse) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: CreateLatestRequestResponse | undefined, error: Error | null) => void;
}

const useCreateLatestRequest = (
  options?: UseCreateLatestRequestOptions &
  Partial<UseMutationOptions<CreateLatestRequestResponse, Error, CreateLatestRequestPayload>>
) => {
  const {
    onSuccess,
    onError,
    onSettled,
    ...mutationOptions
  } = options || {};

  const mutation = useMutation({
    mutationFn: async (payload: CreateLatestRequestPayload) => {
      const response = await API('technicalReview.request.createLatest', {
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

export default useCreateLatestRequest;
