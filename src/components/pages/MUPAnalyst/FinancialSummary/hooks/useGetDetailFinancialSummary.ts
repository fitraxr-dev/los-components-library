import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancingAnalysisControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new FinancingAnalysisControllerApi() ;

const useGetDetailFinancialSummary = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailFinancingAnalysis(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['financing-summary-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailFinancialSummary;
