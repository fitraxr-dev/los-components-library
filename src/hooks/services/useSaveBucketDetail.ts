import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { BucketDetailRequestDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useSaveBucketDetail = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: BucketDetailRequestDto) => {
      const res = await api.saveBucketDetail(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (payload, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveBucketDetail;
