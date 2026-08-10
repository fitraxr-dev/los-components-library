import { useQuery } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface UseGetVisitDetailParams {
  bucketMasterId?: string;
  bucketProcessId: string;
  module?: string;
  process?: string;
  visitCode?: string;
  enabled?: boolean;
}

const useGetVisitDetail = (
  params: UseGetVisitDetailParams,
  config?: Partial<UseQueryOptions<any>>
) => {
  const {
    bucketMasterId,
    bucketProcessId,
    module = TypeModule.SITE_VISIT,
    process = TypeProcess.SITE_VISIT,
    visitCode,
    enabled = true,
  } = params;

  return useQuery({
    enabled: enabled && !!bucketProcessId,
    queryFn: async () => {
      const response = await API('siteVisit.siteVisit.visitDetail', {
        data: {
          bucketMasterId,
          bucketProcessId,
          module,
          process,
          visitCode,
        },
      });
      return response.data;
    },
    queryKey: ['visit-detail', bucketProcessId, visitCode],
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...config,
  });
};

export default useGetVisitDetail;
