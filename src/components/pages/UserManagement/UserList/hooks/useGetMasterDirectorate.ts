import { useQuery } from '@tanstack/react-query';

import { MasterV2ControllerApi } from '@/services/openapi/user-management-service';

import type {
  GenericBucketRequestDtoDirectorateFilterRequest,
  GenericBucketResponseDtoGeneralLabel,
} from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterV2ControllerApi();
const useGetMasterDirectorate = (
  payload: GenericBucketRequestDtoDirectorateFilterRequest,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoGeneralLabel>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.retrieveDirectorateMaster(payload);

      return res.data.data;
    },
    queryKey: ['um-master-all-directorate', payload],
    ...config,
  });

  return query;
};

export default useGetMasterDirectorate;
