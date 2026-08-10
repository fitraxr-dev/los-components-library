import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { AccessMenuControllerApi } from '@/services/openapi/user-management-service';

import type {
  GenericBucketRequestDtoAccessMenuUsageFilterRequest,
  GenericBucketResponseDtoAccessMenuUserUsageResponse,
} from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AccessMenuControllerApi();

const useGetUserUsageList = (
  payload: GenericBucketRequestDtoAccessMenuUsageFilterRequest,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoAccessMenuUserUsageResponse>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.retrieveUsageUser(payload);

      return res.data.data;
    },
    queryKey: ['access-menu-user-usage', payload],
    ...config,
  });

  return query;
};

export default useGetUserUsageList;
