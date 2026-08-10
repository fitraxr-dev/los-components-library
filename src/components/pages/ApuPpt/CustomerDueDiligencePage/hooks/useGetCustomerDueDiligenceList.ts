import { useQuery } from '@tanstack/react-query';

import { CustomerDueDiligenceControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new CustomerDueDiligenceControllerApi();

const useGetCustomerDueDiligenceList = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListCustomerDueDiligence(payload);

      return res.data.data.contents;
    },
    queryKey: ['customer-due-diligence-list', payload],
  });

  return query;
};

export default useGetCustomerDueDiligenceList;
