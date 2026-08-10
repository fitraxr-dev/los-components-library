import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByProcessIdDtoString, SummaryOtherBankFacilityResponseDto } from '../FinancingFacility.type';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetFinancingFacilityOtherBankSummary = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<SummaryOtherBankFacilityResponseDto[]>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('mip.financingFacilityOtherBank.summary', {
        data: payload,
      });

      return res.data.data.contents;
    },
    queryKey: ['financingFacilityOtherBankSummaryList', payload],
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityOtherBankSummary;
