import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { UserControllerApi } from '@/services/openapi/user-management-service';

import type { AutocompleteUserRequest, UserDetailResponse } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new UserControllerApi();

const useSearchAllUser = (
  payload: AutocompleteUserRequest,
  config?: Partial<UseQueryOptions<UserDetailResponse>>) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.userAllSearch(payload);
      return res.data.data;
    },
    queryKey: ['users', payload],
    ...config,
  });
  return query;
};

export default useSearchAllUser;
