import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancialIndustryAnalysisControllerApi } from '@/services/openapi/mip-service';

import type { FinancialIndustryAnalysisResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new FinancialIndustryAnalysisControllerApi();

const useGetIndustryAnalysisById = (payload: RequestByProcessIdDtoString, config?: Partial<UseQueryOptions>) => {
  const query = useQuery<FinancialIndustryAnalysisResponseDto>({
    queryFn: async () => {
      const res = await api.getDetailFinancialIndustryAnalysis(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-industry-analysis', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};


export default useGetIndustryAnalysisById;
