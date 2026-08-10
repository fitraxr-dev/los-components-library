import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type {
  BaseResponseGenericSingleDtoMaintenanceGroupDetail,
  RequestByIdDtoString,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new GroupV2ControllerApi();


const useGetGroupById = (
  payload: RequestByIdDtoString,
  config?: Partial<UseQueryOptions<BaseResponseGenericSingleDtoMaintenanceGroupDetail>>

) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      if (payload?.id?.includes('GRP')) {
        const res = await api.retrieveDetailGroup(payload);
        return res?.data;
      } else {
        const res = await api.detailGroupSubmission(payload);
        return res?.data;
      }
    },
    queryKey: ['get-group-detail-by-id', payload],
    ...config,
  });

  return query;
};

export default useGetGroupById;
