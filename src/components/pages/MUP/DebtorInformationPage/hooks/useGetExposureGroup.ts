import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetExposureGroup = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: payload.bucketProcessId !== undefined && payload.bucketProcessId !== null,
    initialData: [],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getExposureGroupBucket(payload);

      return res.data.data.contents;

    },
    queryKey: ['debtor-exposure-group', payload],
  });

  return query;
};

export default useGetExposureGroup;
