import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { BucketResponseDto, RequestByBcmDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetBcmById = (
  payload: RequestByBcmDto,
  config?: Partial<UseQueryOptions<BucketResponseDto>>
) => {
  const query = useQuery({
    enabled: Object.values(payload).every((value) => !!value),
    queryFn: async () => {
      const res = await api.getBucketByBcm(payload);

      return res.data.data.content;
    },
    queryKey: ['bucket', payload],
    ...config,
  });

  return query;
};

export default useGetBcmById;
