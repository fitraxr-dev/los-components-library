import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ExecutiveSummaryControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new ExecutiveSummaryControllerApi();

const useGetExecutiveSummaryById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailExecutiveSummary(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-executive-summary', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetExecutiveSummaryById;
