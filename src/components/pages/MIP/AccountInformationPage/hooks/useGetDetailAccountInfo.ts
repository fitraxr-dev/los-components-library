import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AccountBankControllerApi } from '@/services/openapi/mip-service';

import type { AccountBankRequestDto, AccountBankResponseDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AccountBankControllerApi();


const useGetDetailAccountInfo = (
  payload: AccountBankRequestDto,
  config?: Partial<UseQueryOptions<AccountBankResponseDto>>
) => {
  const query = useQuery({
    enabled: payload.id !== undefined &&
    payload.id !== null,
    queryFn: async () => {
      const res = await api.detailAccountBank(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['detail-account-info', payload],
  });

  return query;
};


export default useGetDetailAccountInfo;
