import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ShariaComplianceChecklistControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong, ShariaComplianceChecklistResponseDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ShariaComplianceChecklistControllerApi();

const useGetDetailShariaCompliance = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions<ShariaComplianceChecklistResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailShariaComplianceChecklist(payload);

      return res.data.data.content;
    },
    queryKey: ['sharia-compliance-detail', { id: payload.id }],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDetailShariaCompliance;
