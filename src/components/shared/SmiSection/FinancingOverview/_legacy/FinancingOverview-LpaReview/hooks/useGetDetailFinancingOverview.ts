import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancingFacilityOverviewControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/lpa-service';


const api = new FinancingFacilityOverviewControllerApi() ;

const useGetDetailFinancingOverview = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailFinancingFacilityOverview(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['financing-overview', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailFinancingOverview;
