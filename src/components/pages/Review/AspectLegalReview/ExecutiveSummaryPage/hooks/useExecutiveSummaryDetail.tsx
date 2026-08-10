import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ExecutiveOverviewControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new ExecutiveOverviewControllerApi();

const useExecutiveSummaryDetail = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailExecutiveOverview(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['executive-summary-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useExecutiveSummaryDetail;
