import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DebtSecuritiesControllerApi } from '@/services/openapi/master-service';

import type { DebtSecuritiesResponseDto, GetDebtorRequestDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtSecuritiesControllerApi();

const useGetDebtSecuritiesDebtorList = (
  payload: GetDebtorRequestDto,
  config?: Partial<UseQueryOptions<DebtSecuritiesResponseDto[]>>
) => {
  const query = useQuery({

    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListDebtSecuritiesDebtor(payload);

      return res.data.data.contents;
    },
    queryKey: ['debt-securities-debtor-list', payload],
    ...config,
  });
  return query;
};

export default useGetDebtSecuritiesDebtorList;
