import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { FinancingFacilityOtherBankControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString, SummaryOtherBankFacilityResponseDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new FinancingFacilityOtherBankControllerApi();

const useGetFinancingFacilityOtherBankSummary = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<SummaryOtherBankFacilityResponseDto[]>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getSummaryFinancingFacilityOtherBank(payload);

      return res.data.data.contents;
    },
    queryKey: ['financingFacilityOtherBankSummaryList', payload],
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityOtherBankSummary;
