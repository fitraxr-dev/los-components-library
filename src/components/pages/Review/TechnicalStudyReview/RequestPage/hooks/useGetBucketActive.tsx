import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type {
  GenericBucketRequestDtoMapStringObject,
  GenericBucketResponseDtoBucketActiveResponseDto,
} from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetBucketActive = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoBucketActiveResponseDto>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getBucketActive(payload);
        return res.data.data;
      },
      queryKey: [
        'bucket-active',
        payload
      ],
      ...config,
    }
  );

  return query;
};

export default useGetBucketActive;
