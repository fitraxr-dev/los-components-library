import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancingFacilityOtherBankControllerApi } from '@/services/openapi/mip-service';

import type {
  BaseResponseGenericSingleDtoFinancingFacilityOtherBankResponseDto,
  FinancingFacilityOtherBankResponseDto,
  RequestByIdDtoLong,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new FinancingFacilityOtherBankControllerApi();

const useGetFinancingFacilityOtherBankById = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<FinancingFacilityOtherBankResponseDto>({
    queryFn: async () => {
      const res = await api.getDetailFinancingFacilityOtherBank(payload);

      return res.data;
    },
    queryKey: [
      'financingFacilityOtherBank',
      { id: payload?.id }
    ],
    select: (res: BaseResponseGenericSingleDtoFinancingFacilityOtherBankResponseDto) => res.data?.content,
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityOtherBankById;
