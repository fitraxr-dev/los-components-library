import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AnalysisSponsorCompanyControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AnalysisSponsorCompanyControllerApi();

const useGetSponsorCompanyAnalysis = (payload: RequestByProcessIdDtoString, config?: Partial<UseQueryOptions>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailAnalysisSponsorCompany(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-sponsor-company-analysis', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};


export default useGetSponsorCompanyAnalysis;
