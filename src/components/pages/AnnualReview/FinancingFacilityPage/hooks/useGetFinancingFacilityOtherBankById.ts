import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type {
  BaseResponseGenericSingleDtoFinancingFacilityOtherBankResponseDto,
  FinancingFacilityOtherBankResponseDto,
  RequestByIdDtoLong,
} from '../FinancingFacility.type';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetFinancingFacilityOtherBankById = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<FinancingFacilityOtherBankResponseDto>({
    queryFn: async () => {
      const res = await API('mip.financingFacilityOtherBank.detail', {
        data: payload,
      });

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
