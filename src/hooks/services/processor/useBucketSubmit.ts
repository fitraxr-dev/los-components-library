import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface BucketSubmitParams {
  bucketProcessId: string;
  module: string;
  process: string;
  action: string;
  comment: string;
}

const useBucketSubmit = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const mutation = useMutation({
    mutationFn: async (params: BucketSubmitParams) => {
      const res = await API('processor.processor.bucketSubmit', {
        data: params,
      });

      return res.data;
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });

  return mutation;
};

export default useBucketSubmit;
