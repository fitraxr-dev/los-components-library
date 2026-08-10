import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BmppMonitoringControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto,
} from '@/services/openapi/master-service';


const api = new BmppMonitoringControllerApi();

const useGetDebtorProposedLists = (
  payload: GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto,
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getFinancingFacilityProposal1(payload);

      return res.data?.data;
    },
    queryKey: ['proposed-debtor-ff-monitoring', payload],
  });

  return query;
};

export default useGetDebtorProposedLists;
