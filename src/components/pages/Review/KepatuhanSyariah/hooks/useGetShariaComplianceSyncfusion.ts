import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ShariaComplianceChecklistControllerApi } from '@/services/openapi/mip-service';

import type {
  RequestByProcessIdDtoString,
  ShariaComplianceAdditionalInformationResponseDto,
  ShariaComplianceChecklistResponseDto,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ShariaComplianceChecklistControllerApi();

const useGetShariaComplianceSyncfusion = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<ShariaComplianceAdditionalInformationResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailShariaComplianceAdditionalInformation(payload);

      return res.data.data.content;
    },
    queryKey: ['sharia-compliance-detail-additional-information'],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetShariaComplianceSyncfusion;
