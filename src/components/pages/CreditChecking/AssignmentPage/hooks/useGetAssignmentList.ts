import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AssignmentControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoMapStringObject } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AssignmentControllerApi();

const useGetAssignmentList = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: Partial<UseQueryOptions<GenericBucketRequestDtoMapStringObject>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAssignmentList(payload);

      return res.data?.data;
    },
    queryKey: ['assignment-list', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });
  return query;
};

export default useGetAssignmentList;
