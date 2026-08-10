import { useQuery } from '@tanstack/react-query';

import { RequestControllerApi } from '@/services/openapi/credit-checking-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/credit-checking-service';


const api = new RequestControllerApi();

const useGetCreditCheckingRequestDetail = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailCreditChecking(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['credit-checking-request', payload],
  });

  return query;
};


export default useGetCreditCheckingRequestDetail;
