import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { UserV2ControllerApi } from '@/services/openapi/user-management-service';

import type { GenericBucketRequestDtoUserFilterRequest } from '@/services/openapi/user-management-service';


const api = new UserV2ControllerApi();

const useGetUserList = (payload: GenericBucketRequestDtoUserFilterRequest) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAllUser(payload);

      return res.data.data;
    },
    queryKey: ['um-user-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetUserList;
