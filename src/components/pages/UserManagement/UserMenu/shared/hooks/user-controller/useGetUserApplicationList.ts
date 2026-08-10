import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { UserControllerApi } from '@/services/openapi/user-management-service';

import type { GenericBucketRequest } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new UserControllerApi();

const useGetUserApplicationList = (
  payload: GenericBucketRequest,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    queryFn: async () => {
      const res = await api.listUserManagementApplication(payload);

      return res.data.data.contents;
    },
    queryKey: ['list-user-management-application'],
    ...config,
  });

  return query;
};

export default useGetUserApplicationList;
