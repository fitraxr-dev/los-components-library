import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancingFacilityMipControllerApi } from '@/services/openapi/mip-service';

import type {
  BaseResponseGenericSingleDtoFinancingFacilityMipResponseDto,
  FinancingFacilityMipResponseDto,
  RequestByProcessIdDtoString,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new FinancingFacilityMipControllerApi();

const useGetFinancingFacilityMipDetail = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<FinancingFacilityMipResponseDto>({
    queryFn: async () => {
      const res = await api.getDetailFinancingFacilityMip(payload);

      return res.data;
    },
    queryKey: [
      'financingFacilityMipDetail',
      { id: payload?.bucketProcessId }
    ],
    select: (res: BaseResponseGenericSingleDtoFinancingFacilityMipResponseDto) => res.data?.content,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityMipDetail;
