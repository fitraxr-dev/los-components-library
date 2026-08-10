import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ParameterSLAFilterSubmissionDetailRequest {
  bucketProcessId?: string;
  module?: string;
  process?: string;
  menuCode?: string;
}

const useGetParameterSLASubmissionDetail = (
  payload: ParameterSLAFilterSubmissionDetailRequest,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterSla.submissionDetail', {
        data: payload,
      });

      return res.data?.data;
    },
    ...config,
    queryKey: ['parameter-sla-submission-detail', payload],
  });
  return query;
};

export default useGetParameterSLASubmissionDetail;
