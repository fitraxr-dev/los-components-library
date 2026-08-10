import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AnalysisSponsorCompanyOverviewControllerApi } from '@/services/openapi/mip-service';

import type { FinancialIndustryAnalysisDto, RequestByBucketProcessIdDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AnalysisSponsorCompanyOverviewControllerApi();

const useGetSponsorCompanyOverview = (payload: RequestByBucketProcessIdDto, config?: Partial<UseQueryOptions>) => {
  const query = useQuery<FinancialIndustryAnalysisDto>({
    queryFn: async () => {
      const res = await api.getDetailAnalysisSponsorCompanyOverview(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-sponsor-company-overview', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};


export default useGetSponsorCompanyOverview;
