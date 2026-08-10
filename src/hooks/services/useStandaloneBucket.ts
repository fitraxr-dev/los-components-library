import { useMutation } from '@tanstack/react-query';

import { PipelineControllerApi } from '@/services/openapi/bucket-service';

import type {
  BucketCreateRequestDto,
  GenericSingleDtoBucketCreateResponseDto,
} from '@/services/openapi/bucket-service';


const api = new PipelineControllerApi();

const useStandaloneBucket = ({
  onSuccess = (data: GenericSingleDtoBucketCreateResponseDto) => {},
  onError = (error: any) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: BucketCreateRequestDto) => {
      const res = await api.saveStandaloneBucket(payload);

      return res.data.data;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: (data) => {
      onSuccess(data);
    },
  });

  return mutation;
};

export default useStandaloneBucket;
