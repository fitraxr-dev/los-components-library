import { useQuery } from '@tanstack/react-query';

import { CustomerDueDiligenceControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new CustomerDueDiligenceControllerApi();

const useGetDetailCustomerDue = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailCustomerDueDiligence(payload);
      return res.data.data.content;
    },
    queryKey: ['customer-due-diligence', payload],
  });

  return query;
};

export default useGetDetailCustomerDue;
