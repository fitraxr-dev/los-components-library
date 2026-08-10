import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { AccessMenuControllerApi } from '@/services/openapi/user-management-service';

import type {
  GenericBucketRequestDtoAccessMenuFilterRequest,
  GenericBucketResponseDtoAccessMenuListResponse,
} from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AccessMenuControllerApi();


const useGetAccessList = (
  payload: GenericBucketRequestDtoAccessMenuFilterRequest,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoAccessMenuListResponse>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.retrieveAllAccessMenu(payload);

        return res.data.data;
      },
      queryKey: [
        'access-menu-list',
        payload
      ],
      ...config,
    }
  );

  return query;
};


export default useGetAccessList;
