import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RoutineReportingControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong, RoutineSubReportingRequestDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new RoutineReportingControllerApi();

const useGetDetailSubRoutineReport = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions<RoutineSubReportingRequestDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailRoutineSubReporting(payload);

      return res.data.data.content;
    },
    queryKey: ['get-detail-sub-routine-reporting', payload.id],
    staleTime: ONE_MINUTE,
    ...config,
    enabled: payload.id !== undefined,
  });

  return query;
};

export default useGetDetailSubRoutineReport;
