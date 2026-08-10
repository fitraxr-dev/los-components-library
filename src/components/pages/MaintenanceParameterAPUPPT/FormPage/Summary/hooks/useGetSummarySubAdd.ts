import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SummarySubAddParams {
  bucketProcessId: string;
}

const useGetSummarySubAdd = (params: SummarySubAddParams) => {
  const query = useQuery({
    enabled: true, // Always enabled, let API handle null bucketProcessId
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.summarySubitemAdd', {
        data: {
          bucketProcessId: params.bucketProcessId,
        },
      });
      return res.data?.data;
    },
    queryKey: ['parameter-group-summary-sub-add', params.bucketProcessId],
  });
  return query;
};

export default useGetSummarySubAdd;
