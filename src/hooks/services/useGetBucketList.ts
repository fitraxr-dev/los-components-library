import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type {
  GenericBucketRequestDtoMapStringObject,
  GenericBucketResponseDtoBucketResponseDto,
} from './useGetBucketList.types';
import type { UseQueryOptions } from '@tanstack/react-query';


interface UseGetBucketListConfig extends Partial<UseQueryOptions<GenericBucketResponseDtoBucketResponseDto>> {
  enableRefetch?: boolean;
}

const useGetBucketList = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: UseGetBucketListConfig
) => {
  const { enableRefetch = false, ...queryConfig } = config || {};

  const query = useQuery<GenericBucketResponseDtoBucketResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.bucketList.monitoring', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey: ['bucket-list', payload],
    refetchInterval: enableRefetch ? 5000 : undefined,
    ...queryConfig,
  });

  return query;
};

export default useGetBucketList;
