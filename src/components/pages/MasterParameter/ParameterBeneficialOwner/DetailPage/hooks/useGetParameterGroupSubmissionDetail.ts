import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ParameterGroupFilterDetailRequest {
  bucketProcessId?: string;
}

const useGetParameterGroupSubmissionDetail = (
  payload: ParameterGroupFilterDetailRequest,
  config?: Partial<UseQueryOptions>
) => {
  enabled: !!payload.bucketProcessId;
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.submissionDetail', {
        data: payload,
      });

      return res.data?.data;
    },
    ...config,
    queryKey: ['parameter-group', 'detail', payload],
  });
  return query;
};

export default useGetParameterGroupSubmissionDetail;
