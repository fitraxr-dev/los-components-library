import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type {
  GenericBucketRequestDtoMapStringObject,
  GenericBucketResponseDtoBucketResponseDto,
} from '@/hooks/services/useGetBucketList.types';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetBucketList = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoBucketResponseDto>>
) => {
  const query = useQuery<GenericBucketResponseDtoBucketResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.reassignmentSku.list', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey: ['bucket-list', payload],
    ...config,
  });

  return query;
};

export default useGetBucketList;
