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
  const query = useQuery({
    enabled: !!payload.bucketProcessId,
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.submissionDetail', {
        data: payload,
      });

      return res.data?.data;
    },
    ...config,
    queryKey: ['parameter-group', 'sub-item', 'detail', payload],
  });
  return query;
};

export default useGetParameterGroupSubmissionDetail;
