import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RoutineReportingControllerApi } from '@/services/openapi/mip-service';

import type { ListRoutineReportingResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new RoutineReportingControllerApi();

const useGetListRoutineReporting = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<ListRoutineReportingResponseDto[]>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListRoutineReporting(payload);

      return res.data.data.contents;
    },
    queryKey: ['get-list-routine-reporting'],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetListRoutineReporting;
