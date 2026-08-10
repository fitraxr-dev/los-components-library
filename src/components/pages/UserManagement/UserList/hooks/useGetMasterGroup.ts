import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MasterV2ControllerApi } from '@/services/openapi/user-management-service';

import type { GenericBucketRequestDtoGroupFilterRequest } from '@/services/openapi/user-management-service';


const api = new MasterV2ControllerApi();

const useGetMasterGroup = (payload: GenericBucketRequestDtoGroupFilterRequest) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.retrieveGroupMaster(payload);

      return res.data.data;
    },

    queryKey: ['um-master-group-list', payload],
  });

  return query;
};

export default useGetMasterGroup;
