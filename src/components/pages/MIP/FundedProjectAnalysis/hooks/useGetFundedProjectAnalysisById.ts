import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AnalysisFundedProjectControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new AnalysisFundedProjectControllerApi();

const useGetFundedProjectAnalysisById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: Object.entries(payload).every((value) => !!value),
    queryFn: async () => {
      const res = await api.getDetailAnalysisFundedProject(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-funded-project-analysis', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetFundedProjectAnalysisById;
