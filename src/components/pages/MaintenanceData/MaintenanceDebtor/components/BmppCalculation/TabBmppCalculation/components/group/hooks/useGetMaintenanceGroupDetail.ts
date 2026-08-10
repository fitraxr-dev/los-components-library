import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoString } from '@/services/openapi/master-service';


const api = new GroupV2ControllerApi();

const useGetMaintenanceGroupDetail = (payload: RequestByIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.detailGroupSubmission(payload);
      return res.data.data;
    },
    queryKey: ['maintenance-group-detail', payload],
  });

  return query;
};

export default useGetMaintenanceGroupDetail;
