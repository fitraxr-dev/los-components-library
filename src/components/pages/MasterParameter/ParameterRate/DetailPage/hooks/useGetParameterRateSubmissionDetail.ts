import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ParameterRateFilterDetailRequest {
  bucketProcessId?: string;
  menuCode?: string;
}

const useGetParameterRateSubmissionDetail = (
  payload: ParameterRateFilterDetailRequest,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterRate.submissionDetail', {
        data: payload,
      });

      return res.data?.data;
    },
    ...config,
    queryKey: ['parameter-rate', 'detail', payload],
  });
  return query;
};

export default useGetParameterRateSubmissionDetail;
