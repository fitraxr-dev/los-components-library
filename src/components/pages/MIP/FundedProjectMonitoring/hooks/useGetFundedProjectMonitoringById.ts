import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { MonitoringAnalysisFundedProjectControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new MonitoringAnalysisFundedProjectControllerApi();

const useGetFundedProjectMonitoringById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailMonitoringAnalysisFundedProject(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-funded-project-monitoring', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetFundedProjectMonitoringById;
