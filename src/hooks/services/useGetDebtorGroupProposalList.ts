import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancingFacilityControllerApi } from '@/services/openapi/bucket-service';

import type { GetFinancingFacilityRequestDto } from '@/services/openapi/bucket-service';


const api = new FinancingFacilityControllerApi();

const useGetDebtorGroupProposalList = (
  payload: GetFinancingFacilityRequestDto,
  isEnable?: boolean) => {
  const query = useQuery({
    enabled: isEnable,
    queryFn: async () => {
      const res = await api.getFinancingFacilityFilteredAsGroupDebtor(payload);

      return res.data.data.contents;
    },
    queryKey: ['debtor-group-proposal-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetDebtorGroupProposalList;
