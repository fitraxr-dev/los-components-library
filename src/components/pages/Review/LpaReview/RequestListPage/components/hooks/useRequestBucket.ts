import { useMutation } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useRequestModalBucket = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: BucketCreateRequestDto) => {
      const res = await api.registerBucketDebtor(payload);

      return res.data.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      onSuccess(data);
    },
  });

  return mutation;
};

export default useRequestModalBucket;
