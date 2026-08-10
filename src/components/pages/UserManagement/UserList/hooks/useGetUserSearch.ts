import { useQuery } from '@tanstack/react-query';

import { UserControllerApi } from '@/services/openapi/user-management-service';

import type { AutocompleteUserRequest, UserDetailResponse } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new UserControllerApi();

const useGetUserSearch = (
  payload: any,
  config?: Partial<UseQueryOptions<UserDetailResponse[]>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.userAllSearch(payload);

      return res.data.data.contents;
    },
    queryKey: ['um-user-search', payload],
    ...config,
  });

  return query;
};

export default useGetUserSearch;
