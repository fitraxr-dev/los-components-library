import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type {
  GenericBucketRequestDtoMapStringObject,
  GenericBucketResponseDtoBucketResponseDto,
} from './useGetBucketListAssignment.types';
import type { UseQueryOptions } from '@tanstack/react-query';


interface UseGetBucketListAssignmentConfig extends Partial<UseQueryOptions<GenericBucketResponseDtoBucketResponseDto>> {
  enableRefetch?: boolean;
}

const useGetBucketListAssignment = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: UseGetBucketListAssignmentConfig
) => {
  const { enableRefetch = false, ...queryConfig } = config || {};

  const query = useQuery<GenericBucketResponseDtoBucketResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.bucketList.assignment', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey: ['bucket-list-assignment', payload],
    refetchInterval: enableRefetch ? 5000 : undefined,
    ...queryConfig,
  });

  return query;
};

export default useGetBucketListAssignment;
