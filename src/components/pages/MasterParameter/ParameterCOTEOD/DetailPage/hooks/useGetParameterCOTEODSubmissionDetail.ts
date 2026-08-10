import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface GetParameterCotEodSubmissionDetailRequest {
  bucketProcessId?: string;
  module?: string;
  process?: string;
  menuCode?: string;
}

const useGetParameterCOTEODSubmissionDetail = (
  payload: GetParameterCotEodSubmissionDetailRequest,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterCotEod.submissionDetail', {
        data: payload,
      });

      return res.data?.data;
    },
    ...config,
    queryKey: ['parameter-cot-eod', 'detail', payload],
  });
  return query;
};

export default useGetParameterCOTEODSubmissionDetail;
