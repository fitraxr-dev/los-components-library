import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AccountBankControllerApi } from '@/services/openapi/mip-service';

import type {
  GenericBucketRequestDtoMapStringObject,
  BaseResponseGenericBucketResponseDtoAccountBankResponseDto,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AccountBankControllerApi();

const useGetAccountInformationList = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: Partial<UseQueryOptions<BaseResponseGenericBucketResponseDtoAccountBankResponseDto>>
) => {
  const query = useQuery({
    gcTime: ONE_MINUTE,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await api.getListAccountBank(payload);

      return response.data;
    },
    queryKey: ['account-information-list', payload],
    ...config,
  });

  return query;
};

export default useGetAccountInformationList;
