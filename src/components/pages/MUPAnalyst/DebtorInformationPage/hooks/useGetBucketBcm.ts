import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByBcmDto, BucketResponseDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetBucketBcm = (
  payload: RequestByBcmDto,
  config?: Partial<UseQueryOptions<BucketResponseDto>>,
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getBucketByBcm(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['bucket-bcm', payload],
    ...config,
  });
  return query;
};

export default useGetBucketBcm;
