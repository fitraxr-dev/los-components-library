import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BucketListControllerApi } from '@/services/openapi/bucket-service';

import type {
  GenericBucketRequestDtoMapStringObject,
  GenericBucketResponseDtoBucketResponseDto,
} from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketListControllerApi();

const useGetBucketCollaboration = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoBucketResponseDto>>) => {

  const query = useQuery({
    initialData: [],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getUserCollaborationBucketProcessList(payload);

      return res.data.data;
    },
    queryKey: ['get-user-collaboration', payload],
    ...config,
  });
  return query;
};

export default useGetBucketCollaboration;
