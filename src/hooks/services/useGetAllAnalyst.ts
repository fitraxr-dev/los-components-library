import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { UserControllerApi } from '@/services/openapi/user-management-service';

import type { AutocompleteRequest, UserDetailResponse } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new UserControllerApi();

const useGetAllAnalyst = (
  payload: AutocompleteRequest,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<UserDetailResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.userAnalyst(payload);

      return res.data.data;
    },
    queryKey: ['analysts', payload],
    select: (res: UserDetailResponse) => res,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetAllAnalyst;
