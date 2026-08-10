import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto,
} from '@/services/openapi/master-service';


const api = new SimulationBmppControllerApi();

const useGetDebtorExistingLists = (
  payload: GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto,
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getFinancingFacilityExisting(payload);

      return res.data?.data;
    },
    queryKey: ['existing-debtor-financing-facility', payload],
  });

  return query;
};

export default useGetDebtorExistingLists;
