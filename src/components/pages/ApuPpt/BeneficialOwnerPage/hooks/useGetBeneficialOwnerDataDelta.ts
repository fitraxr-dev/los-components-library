import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { BeneficialOwnerControllerApi } from '@/services/openapi/mip-service';

import type {
  DataDeltaResponseDtoListBeneficialOwnerResponseDto,
  GenericWithPreviousDataRequestDto,
} from '@/services/openapi/mip-service';


const api = new BeneficialOwnerControllerApi();

const useGetBeneficialOwnerDataDelta = (
  payload: GenericWithPreviousDataRequestDto,
  config?: Partial<UseQueryOptions<DataDeltaResponseDtoListBeneficialOwnerResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {

      const res = await api.getDataDeltaBeneficialOwner(payload);
      return res.data.data.content;
    },
    queryKey: ['beneficial-owner-data-delta', payload],
    ...config,
  });

  return query;
};

export default useGetBeneficialOwnerDataDelta;
