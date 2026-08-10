import { useQuery } from '@tanstack/react-query';

import { CustomerDueDiligenceControllerApi } from '@/services/openapi/mip-service';


import type {
  CustomerDueDiligenceResponseDto,
  GenericWithPreviousDataRequestDto,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CustomerDueDiligenceControllerApi();

const useGetCustomerDueDiligenceListChild = (
  payload: GenericWithPreviousDataRequestDto,
  config?: Partial<UseQueryOptions<CustomerDueDiligenceResponseDto[]>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListCustomerDueDiligenceIncludeSubDoc(payload);
      return res.data.data.contents;

    },
    queryKey: ['customer-due-diligence-list-child', payload],
    ...config,
  });

  return query;
};

export default useGetCustomerDueDiligenceListChild;
