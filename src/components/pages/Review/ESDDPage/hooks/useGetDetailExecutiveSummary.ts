import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ExecutiveSummaryControllerApi } from '@/services/openapi/mip-service';

import type { ExecutiveSummaryResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ExecutiveSummaryControllerApi();

const useGetDetailExecutiveSummary = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<ExecutiveSummaryResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailExecutiveSummary(payload);

      return res.data.data.content;
    },
    queryKey: ['detail-executive-summary', payload.bucketProcessId],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDetailExecutiveSummary;
