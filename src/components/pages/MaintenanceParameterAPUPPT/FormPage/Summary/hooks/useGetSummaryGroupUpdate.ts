import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SummaryGroupUpdateParams {
  bucketProcessId: string;
}

const useGetSummaryGroupUpdate = (params: SummaryGroupUpdateParams) => {
  const query = useQuery({
    enabled: true, // Always enabled, let API handle null bucketProcessId
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.summaryGroupUpdate', {
        data: {
          bucketProcessId: params.bucketProcessId,
        },
      });
      return res.data?.data;
    },
    queryKey: ['parameter-group-summary-update', params.bucketProcessId],
  });
  return query;
};

export default useGetSummaryGroupUpdate;
