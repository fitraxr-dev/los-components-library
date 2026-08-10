import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorNamesetControllerApi } from '@/services/openapi/master-service';

import type {
  BaseResponseListDebtorNamesetResponseDto,
  DebtorNamesetRequestDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtorNamesetControllerApi();

const useGetDebtorNameset = (
  payload: DebtorNamesetRequestDto,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<BaseResponseListDebtorNamesetResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAllDebtorNameset(payload);

      return res.data;
    },
    queryKey: [
      'debtor-nameset',
      {
        institution: payload.institution,
      }
    ],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDebtorNameset;
