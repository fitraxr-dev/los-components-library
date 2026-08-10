import { useQuery } from '@tanstack/react-query';

import { MasterV2ControllerApi } from '@/services/openapi/user-management-service';

import type {
  GenericBucketRequestDtoPositionFilterRequest,
  GenericBucketResponseDtoGeneralLabel,
} from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterV2ControllerApi();

const useGetMasterPosition = (
  payload: GenericBucketRequestDtoPositionFilterRequest,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoGeneralLabel>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.retrievePosition(payload);

      return res.data.data;
    },
    queryKey: ['um-master-positions', payload],
    ...config,
  });

  return query;
};

export default useGetMasterPosition;
