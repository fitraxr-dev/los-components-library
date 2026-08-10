import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type {
  RequestByProcessIdDtoString,
  BaseResponseGenericSingleDtoBucketCreateResponseDto,
  BucketResponseDto,
} from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetPipelineById = (payload: RequestByProcessIdDtoString, config?: Partial<UseQueryOptions>) => {
  const query = useQuery<BucketResponseDto>({
    enabled: payload.bucketProcessId !== undefined &&
    payload.bucketProcessId !== null &&
    payload.bucketProcessId !== '',
    queryFn: async () => {
      const res = await api.getBucketDetail(payload);
      return res.data;
    },
    queryKey: ['pipeline', { id: payload.bucketProcessId }],
    select: (res: BaseResponseGenericSingleDtoBucketCreateResponseDto) => res?.data.content,
    ...config,
  });

  return query;
};

export default useGetPipelineById;
