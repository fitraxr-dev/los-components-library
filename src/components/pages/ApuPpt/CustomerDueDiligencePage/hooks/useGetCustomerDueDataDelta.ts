import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { CustomerDueDiligenceControllerApi } from '@/services/openapi/mip-service';

import type {
  DataDeltaResponseDtoListCustomerDueDiligenceResponseDto,
  GenericWithPreviousDataRequestDto,
} from '@/services/openapi/mip-service';


const api = new CustomerDueDiligenceControllerApi();

const useGetCustomerDueDataDelta = (
  payload: GenericWithPreviousDataRequestDto,
  config?: Partial<UseQueryOptions<DataDeltaResponseDtoListCustomerDueDiligenceResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {

      const res = await api.getDataDeltaCustomerDueDiligence(payload);
      return res.data.data.content;
    },
    queryKey: ['customer-due-diligence-data-delta', payload],
    ...config,
  });

  return query;
};

export default useGetCustomerDueDataDelta;
