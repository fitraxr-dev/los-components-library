import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoDebtorFilterRequestDto,
  BaseResponseGenericBucketResponseDtoMasterDebtorResponseDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtorV2ControllerApi();

const useGetAllDebtor = (
  payload: GenericBucketRequestDtoDebtorFilterRequestDto,
  config?: Partial<UseQueryOptions<BaseResponseGenericBucketResponseDtoMasterDebtorResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAllDebtorUncensored(payload);

      return res.data;
    },
    queryKey: ['all-debtor-list', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetAllDebtor;
