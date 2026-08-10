import { useQuery } from '@tanstack/react-query';

import { UserControllerApi } from '@/services/openapi/user-management-service';

import type { GenericBucketRequest } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new UserControllerApi;

const useGetUserList = (
  payload: GenericBucketRequest,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({

    queryFn: async () => {
      const res = await api.listUserManagement(payload);

      const { contents } = res.data.data;
      const result = contents.map((content) => ({
        email: content.email,
        lastLoginDate: content.lastLogin,
        name: content.fullName,
        userId: content.userId,
        userStatus: content.status,
      }));

      return result;

    },
    queryKey: ['user-management-list', payload],
    ...config,
  });

  return query;
};

export default useGetUserList;
