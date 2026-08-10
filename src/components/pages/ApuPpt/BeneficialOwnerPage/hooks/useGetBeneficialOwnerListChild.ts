import { useQuery } from '@tanstack/react-query';

import { BeneficialOwnerControllerApi } from '@/services/openapi/mip-service';


import type { BeneficialOwnerResponseDto, GenericWithPreviousDataRequestDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BeneficialOwnerControllerApi();

const useGetBeneficialOwnerListChild = (
  payload: GenericWithPreviousDataRequestDto,
  config?: Partial<UseQueryOptions<BeneficialOwnerResponseDto[]>>
) => {
  const query = useQuery({
    queryFn: async () => {

      const res = await api.getListBeneficialOwnerIncludeSubDoc(payload);
      return res.data.data.contents ;
    },
    queryKey: ['beneficial-owners-child', payload],
    ...config,
  });

  return query;
};

export default useGetBeneficialOwnerListChild;
