import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SendMemoDrdPayload {
  bucketProcessId: string;
  module: string;
  process: string;
  ratingId?: string;
}

interface SendMemoDrdResponse {
  success: boolean;
  message?: string;
}

const useSendMemoDrd = (
  config?: {
    onSuccess?: (data: SendMemoDrdResponse) => void;
    onError?: (error: any) => void;
  }
) => {
  const mutation = useMutation<SendMemoDrdResponse, Error, SendMemoDrdPayload>({
    mutationFn: async (payload: SendMemoDrdPayload) => {
      const res = await API('bucketDocument.document.sendMemoDrd', {
        data: payload,
      });

      return res.data?.data ?? { success: true };
    },
    onError: (error) => {
      config?.onError?.(error);
    },
    onSuccess: (data) => {
      config?.onSuccess?.(data);
    },
  });

  return mutation;
};

export default useSendMemoDrd;
