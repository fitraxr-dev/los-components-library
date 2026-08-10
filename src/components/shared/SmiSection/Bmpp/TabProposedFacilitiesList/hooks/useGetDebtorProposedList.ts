import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto,
} from '@/services/openapi/master-service';


const api = new SimulationBmppControllerApi();

const useGetDebtorProposedLists = (
  payload: GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto,
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getFinancingFacilityProposal(payload);

      return res.data?.data;
    },
    queryKey: ['proposed-debtor-financing-facility', payload],
  });

  return query;
};

export default useGetDebtorProposedLists;
