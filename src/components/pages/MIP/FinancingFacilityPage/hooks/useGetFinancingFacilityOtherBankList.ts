import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancingFacilityOtherBankControllerApi } from '@/services/openapi/mip-service';

import type {
  BaseResponseGenericBucketResponseDtoListFinancingFacilityOtherBankResponseDto,
  GenericBucketRequestDtoListFinancingFacilityOtherBankRequestDto,
  GenericBucketResponseDtoListFinancingFacilityOtherBankResponseDto,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new FinancingFacilityOtherBankControllerApi();

const useGetFinancingFacilityOtherBankList = (
  payload: GenericBucketRequestDtoListFinancingFacilityOtherBankRequestDto,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<GenericBucketResponseDtoListFinancingFacilityOtherBankResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListFinancingFacilityOtherBank(payload);

      return res.data;
    },
    queryKey: [
      'financingFacilitiesOtherBank',
      payload
    ],
    select: (res: BaseResponseGenericBucketResponseDtoListFinancingFacilityOtherBankResponseDto) => res.data,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityOtherBankList;
