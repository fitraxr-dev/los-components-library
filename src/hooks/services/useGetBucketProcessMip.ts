import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { BucketResponseDto, RequestByBcmDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();


const useGetBucketProcessMip = (
  payload: RequestByBcmDto,
  config?: Partial<UseQueryOptions<BucketResponseDto>>
) => {
  const query = useQuery(
    {
      enabled: payload.bcmId !== undefined && payload.bcmId !== null,
      queryFn: async () => {
        const res = await api.getBucketProcessMip(payload);
        return res.data.data.content;
      },
      queryKey: [
        'bucket-process-mip',
        payload
      ],
      ...config,
    }
  );

  return query;
};


export default useGetBucketProcessMip;
