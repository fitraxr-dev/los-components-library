import { useQuery } from '@tanstack/react-query';

import { UserV2ControllerApi } from '@/services/openapi/user-management-service';

import type { UserDetailRequest, UserDetailV2Response } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new UserV2ControllerApi();

const useGetDetailUser = (
  payload: UserDetailRequest,
  config?: Partial<UseQueryOptions<UserDetailV2Response>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetail(payload);

      return res.data.data;
    },
    queryKey: ['um-user-detail', payload],
    ...config,
  });

  return query;
};

export default useGetDetailUser;
