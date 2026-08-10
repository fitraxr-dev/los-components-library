import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { CustomerDueDiligenceControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new CustomerDueDiligenceControllerApi();

const useGetCustomerDueDiligenceRemark = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getRemarkCustomerDueDiligence(payload);

      return res.data.data.content;
    },
    queryKey: ['customer-due-diligence-remark', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetCustomerDueDiligenceRemark;
