import { useQuery } from '@tanstack/react-query';

import { CustomerDueDiligenceControllerApi } from '@/services/openapi/mip-service';

import type { GenericWithPreviousDataRequestDto } from '@/services/openapi/mip-service';


const api = new CustomerDueDiligenceControllerApi();

function useGetAssesmentSummaryList(payload: GenericWithPreviousDataRequestDto) {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListCustomerDueDiligenceIncludeSubDoc(payload);

      return res.data.data.contents;
    },

    queryKey: ['customer-due-diligence-list', payload],
  });

  return query;
}

export default useGetAssesmentSummaryList;
