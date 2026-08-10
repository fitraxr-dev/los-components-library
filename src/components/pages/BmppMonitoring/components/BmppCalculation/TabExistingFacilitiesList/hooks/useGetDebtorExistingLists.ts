import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BmppMonitoringControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto,
} from '@/services/openapi/master-service';


const api = new BmppMonitoringControllerApi();

const useGetDebtorExistingLists = (
  payload: GenericBucketRequestDtoFinancingFacilityProposalPlanFilterRequestDto,
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getFinancingFacilityExisting1(payload);

      return res.data?.data;
    },
    queryKey: ['existing-debtor-ff-monitoring', payload],
  });

  return query;
};

export default useGetDebtorExistingLists;
