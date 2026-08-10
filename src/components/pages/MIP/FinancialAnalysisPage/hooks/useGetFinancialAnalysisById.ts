import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancialAnalysisControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new FinancialAnalysisControllerApi();

const useGetFinancialAnalysisById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: Object.entries(payload).every((value) => !!value),
    queryFn: async () => {
      const res = await api.getDetailFinancialAnalysis(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-financial-analysis', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetFinancialAnalysisById;
