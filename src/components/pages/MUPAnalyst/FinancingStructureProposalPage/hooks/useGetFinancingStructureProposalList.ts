import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ProposeFinancingStructureControllerApi } from '@/services/openapi/mip-service';

import type {
  GenericBucketRequestDtoListProposeFinancingStructureRequestDto,
  GenericBucketResponseDtoProposeFinancingStructureResponseDto,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ProposeFinancingStructureControllerApi();

const useGetFinancingStructureProposal = (
  payload: GenericBucketRequestDtoListProposeFinancingStructureRequestDto,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoProposeFinancingStructureResponseDto>>) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListProposeFinancingStructure(payload);

      return res.data.data;
    },
    queryKey: ['financing-structure-proposal-list', payload],
    ...config,
  });
  return query;
};

export default useGetFinancingStructureProposal;
