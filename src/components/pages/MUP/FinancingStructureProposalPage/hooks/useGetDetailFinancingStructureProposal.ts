import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ProposeFinancingStructureControllerApi } from '@/services/openapi/mip-service';

import type { ProposeFinancingStructureResponseDto, RequestByIdDtoLong } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ProposeFinancingStructureControllerApi();

const useGetDetailFinancingStructureProposal = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions<ProposeFinancingStructureResponseDto>>
) => {
  const query = useQuery({
    enabled: !!payload.id,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailProposeFinancingStructure(payload);

      return res.data.data?.content;
    },
    queryKey: ['financing-structure-proposal-detail', payload],
    ...config,
  });
  return query;
};

export default useGetDetailFinancingStructureProposal;
