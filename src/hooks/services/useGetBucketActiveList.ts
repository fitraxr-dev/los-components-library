import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type {
  GenericBucketRequestDtoMapStringObject,
  BaseResponseGenericBucketResponseDtoBucketActiveResponseDto,
} from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetBucketActiveList = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: Partial<UseQueryOptions<BaseResponseGenericBucketResponseDtoBucketActiveResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBucketActive(payload);

      return res.data;
    },
    queryKey: ['bucket-active-list', payload],
    ...config,
  });

  return query;
};

export default useGetBucketActiveList;
