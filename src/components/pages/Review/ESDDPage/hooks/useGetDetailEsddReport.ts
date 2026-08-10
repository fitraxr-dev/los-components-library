import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { EsddReportControllerApi } from '@/services/openapi/mip-service';

import type { EsddReportResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new EsddReportControllerApi();

const useGetDetailEsddReport = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<EsddReportResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailEsddReport(payload);

      return res.data.data.content;
    },
    queryKey: ['detail-esdd-report', payload.bucketProcessId],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDetailEsddReport;
