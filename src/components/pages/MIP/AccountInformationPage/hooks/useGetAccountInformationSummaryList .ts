import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AccountBankControllerApi } from '@/services/openapi/mip-service';

import type {
  AccountBankRequestDto,
  BaseResponseGenericListDtoAccountBankResponseDto,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AccountBankControllerApi();

const useGetAccountInformationSummaryList = (
  payload: AccountBankRequestDto,
  config?: Partial<UseQueryOptions<BaseResponseGenericListDtoAccountBankResponseDto>>
) => {
  const query = useQuery({
    gcTime: ONE_MINUTE,
    queryFn: async () => {
      const response = await api.grandTotalAccountBank(payload);

      return response.data;
    },
    queryKey: ['summary-account-information-list', payload],
    ...config,
  });

  return query;
};

export default useGetAccountInformationSummaryList;
