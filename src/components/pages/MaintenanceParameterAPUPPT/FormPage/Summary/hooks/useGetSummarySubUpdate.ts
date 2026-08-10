import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SummarySubUpdateParams {
  bucketProcessId: string;
}

const useGetSummarySubUpdate = (params: SummarySubUpdateParams) => {
  const query = useQuery({
    enabled: true, // Always enabled, let API handle null bucketProcessId
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.summarySubitem', {
        data: {
          bucketProcessId: params.bucketProcessId,
        },
      });
      return res.data?.data;
    },
    queryKey: ['parameter-group-summary-sub-update', params.bucketProcessId],
  });
  return query;
};

export default useGetSummarySubUpdate;
