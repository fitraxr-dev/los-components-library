import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RoutineReportingControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong, RoutineReportingResponseDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new RoutineReportingControllerApi();

const useGetDetailRoutineReporting = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions<RoutineReportingResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailRoutineReporting(payload);

      return res.data.data.content;
    },
    queryKey: ['get-detail-routine-reporting', payload.id],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDetailRoutineReporting;
