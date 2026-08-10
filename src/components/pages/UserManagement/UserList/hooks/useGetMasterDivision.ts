import { useQuery } from '@tanstack/react-query';

import { MasterV2ControllerApi } from '@/services/openapi/user-management-service';

import type {
  GenericBucketRequestDtoDivisionFilterRequest,
  GenericBucketResponseDtoGeneralLabel,
} from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterV2ControllerApi();

const useGetMasterDivision = (
  payload: GenericBucketRequestDtoDivisionFilterRequest,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoGeneralLabel>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.retrieveDivisionMaster(payload);

      return res.data.data;
    },
    queryKey: ['um-master-divisions', payload],
    ...config,
  });

  return query;
};

export default useGetMasterDivision;
