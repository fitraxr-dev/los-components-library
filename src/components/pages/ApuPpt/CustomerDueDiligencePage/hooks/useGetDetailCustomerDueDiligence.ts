import { useQuery } from '@tanstack/react-query';

import { CustomerDueDiligenceControllerApi } from '@/services/openapi/mip-service';

import type { CustomerDueDiligenceResponseDto, RequestByIdDtoLong } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CustomerDueDiligenceControllerApi();

const useGetDetailCustomerDueDiligence = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions<CustomerDueDiligenceResponseDto>>
) => {

  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailCustomerDueDiligence(payload);

      return res.data.data.content;
    },
    queryKey: ['customer-due-diligence', payload],
    ...config,
  });

  return query;
};

export default useGetDetailCustomerDueDiligence;
