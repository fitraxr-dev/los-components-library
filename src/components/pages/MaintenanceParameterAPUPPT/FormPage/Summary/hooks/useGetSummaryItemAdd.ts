import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SummaryItemAddParams {
  bucketProcessId: string;
}

const useGetSummaryItemAdd = (params: SummaryItemAddParams) => {
  const query = useQuery({
    enabled: true, // Always enabled, let API handle null bucketProcessId
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.summaryItemAdd', {
        data: {
          bucketProcessId: params.bucketProcessId,
        },
      });
      return res.data?.data;
    },
    queryKey: ['parameter-group-summary-item-add', params.bucketProcessId],
  });
  return query;
};

export default useGetSummaryItemAdd;
