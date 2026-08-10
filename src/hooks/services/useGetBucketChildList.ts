import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BucketControllerApi, BucketListControllerApi } from '@/services/openapi/bucket-service';

import type {
  GenericBucketRequestDtoMapStringObject,
  GenericBucketResponseDtoBucketResponseDto,
} from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketListControllerApi();


const useGetBucketChildList = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoBucketResponseDto>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getBucketProcessChild(payload);
        return res.data.data;
      },
      queryKey: [
        'bucket-child-list',
        payload
      ],
      ...config,
    },
  );

  return query;
};


export default useGetBucketChildList;
