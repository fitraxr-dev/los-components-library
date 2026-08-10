import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByProcessIdDtoString, ExposureBucketResponseDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetTotalExposureDebtor = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<ExposureBucketResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getExposureBucket(payload);

      return res.data?.data?.content || {};
    },
    queryKey: ['total-exposure-debtor', payload],
    ...config,
  });
  return query;
};

export default useGetTotalExposureDebtor;
