import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorControllerApi } from '@/services/openapi/loan-service';

import type { BaseResponseDebtorResponseDto, RequestByIdDtoLong } from '@/services/openapi/loan-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtorControllerApi();

const useManagementShareholder = (payload: RequestByIdDtoLong, config?: Partial<UseQueryOptions>) => {
  const query = useQuery<BaseResponseDebtorResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDebtorById(payload);

      return res.data;
    },
    queryKey: ['debtor', { id: payload.id }],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useManagementShareholder;
