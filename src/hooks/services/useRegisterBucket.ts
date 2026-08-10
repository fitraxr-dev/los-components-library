import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type {
  BucketCreateRequestDto,
  BucketCreateResponseDto,
  GenericSingleDtoBucketCreateResponseDto,
} from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useRegisterBucket = ({
  onSuccess = (data: BucketCreateResponseDto) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: BucketCreateRequestDto) => {
      const res = await api.registerBucketDebtor(payload);

      return res.data.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data: GenericSingleDtoBucketCreateResponseDto) => {
      queryClient.invalidateQueries({ queryKey: ['validate-result-debtor']});
      onSuccess(data.content);
    },
  });

  return mutation;
};

export default useRegisterBucket;
