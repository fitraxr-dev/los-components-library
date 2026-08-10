import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByProcessIdDtoString, ExposureGroupBucketResponseDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetExposureGroup = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<ExposureGroupBucketResponseDto[]>>
) => {
  const query = useQuery({
    enabled: payload.bucketProcessId !== undefined && payload.bucketProcessId !== null,
    initialData: [],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getExposureGroupBucket(payload);

      return res.data.data.contents;
    },
    queryKey: ['debtor-exposure-group', payload],
    ...config,
  });

  return query;
};

export default useGetExposureGroup;
