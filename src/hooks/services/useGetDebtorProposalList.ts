import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancingFacilityControllerApi, type GetFinancingFacilityRequestDto } from '@/services/openapi/bucket-service';


const api = new FinancingFacilityControllerApi();

const useGetDebtorProposalList = (
  payload: GetFinancingFacilityRequestDto,
  isEnable?: boolean) => {
  const query = useQuery({
    enabled: isEnable,
    queryFn: async () => {
      const res = await api.getFinancingFacilityFilteredAsDebtor(payload);

      return res.data.data?.contents;
    },
    queryKey: ['debtor-proposal-list', payload],
    select: (data) => data,
  });

  return query;
};

export default useGetDebtorProposalList;
