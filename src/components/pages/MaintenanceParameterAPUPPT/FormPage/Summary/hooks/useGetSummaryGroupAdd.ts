import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SummaryGroupAddParams {
  bucketProcessId: string;
}

const useGetSummaryGroupAdd = (params: SummaryGroupAddParams) => {
  const query = useQuery({
    enabled: true, // Always enabled, let API handle null bucketProcessId
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.summaryGroupAdd', {
        data: {
          bucketProcessId: params.bucketProcessId,
        },
      });
      return res.data?.data;
    },
    queryKey: ['parameter-group-summary-add', params.bucketProcessId],
  });
  return query;
};

export default useGetSummaryGroupAdd;
