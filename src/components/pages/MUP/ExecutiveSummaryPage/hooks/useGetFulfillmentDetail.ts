import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FulfillmentLoanRequirementControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new FulfillmentLoanRequirementControllerApi();

const useGetFulfillmentDetail = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    queryFn: async () => {
      if (!payload?.id) return ;
      const res = await api.getDetailFulfillmentLoanRequirement(payload);
      return res?.data?.data?.content;
    },
    queryKey: ['mup-fulfilment-executive-detail', payload],
  });

  return query;
};


export default useGetFulfillmentDetail;
