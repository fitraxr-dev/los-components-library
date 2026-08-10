import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DebtSecuritiesControllerApi } from '@/services/openapi/master-service';

import type { DebtSecuritiesGroupDebtorResponseDto, GetDebtorRequestDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtSecuritiesControllerApi();

const useGetDebtSecuritiesGroupExcludeDebtorList = (
  payload: GetDebtorRequestDto,
  config?: Partial<UseQueryOptions<DebtSecuritiesGroupDebtorResponseDto[]>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListDebtSecuritiesGroupExcludeDebtor(payload);

      return res.data.data.contents;
    },
    queryKey: ['debt-secuities-exclude-debtor-list', payload],
    ...config,
  });

  return query;
};

export default useGetDebtSecuritiesGroupExcludeDebtorList;
