import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SummaryItemUpdateParams {
  bucketProcessId: string;
}

const useGetSummaryItemUpdate = (params: SummaryItemUpdateParams) => {
  const query = useQuery({
    enabled: true, // Always enabled, let API handle null bucketProcessId
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.summaryItem', {
        data: {
          bucketProcessId: params.bucketProcessId,
        },
      });
      return res.data?.data;
    },
    queryKey: ['parameter-group-summary-item-update', params.bucketProcessId],
  });
  return query;
};

export default useGetSummaryItemUpdate;
