import { useQuery } from '@tanstack/react-query';

import { MasterV2ControllerApi } from '@/services/openapi/user-management-service';

import type {
  GenericBucketRequestDtoString,
  GenericBucketResponseDtoGeneralLabel,
} from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterV2ControllerApi();

const useGetMasterAccessMenu = (
  payload: GenericBucketRequestDtoString,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoGeneralLabel>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.retrieveAccessMenu(payload);

      return res.data.data;
    },

    queryKey: ['um-access-menu', payload],
    ...config,
  });

  return query;
};

export default useGetMasterAccessMenu;
