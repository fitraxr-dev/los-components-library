import { useQuery } from '@tanstack/react-query';

import { MasterV2ControllerApi } from '@/services/openapi/user-management-service';

import type {
  GenericBucketRequestDtoRoleFilterRequest,
  GenericBucketResponseDtoGeneralLabel,
} from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterV2ControllerApi();

const useGetMasterRole = (
  payload: GenericBucketRequestDtoRoleFilterRequest,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoGeneralLabel>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.retrieveRoleMaster(payload);

      return res.data.data;
    },

    queryKey: ['um-master-role-list', payload],
    ...config,
  });

  return query;
};

export default useGetMasterRole;
