import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { IndustryAnalysisControllerApi } from '@/services/openapi/mip-service';

import type { IndustryAnalysisResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new IndustryAnalysisControllerApi();

const useGetIndustryOverviewById = (payload: RequestByProcessIdDtoString, config?: Partial<UseQueryOptions>) => {
  const query = useQuery<IndustryAnalysisResponseDto>({
    queryFn: async () => {
      const res = await api.getDetailIndustryAnalysis(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-industry-overview', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};


export default useGetIndustryOverviewById;
