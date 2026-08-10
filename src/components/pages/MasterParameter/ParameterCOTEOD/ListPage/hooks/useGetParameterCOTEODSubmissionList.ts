import { useQuery } from '@tanstack/react-query';


import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


export interface ParameterCOTEODFilterSubmissionRequest {
  status?: Record<string, string>[];
  startLastModifiedDate?: string;
  endLastModifiedDate?: string;
}

const useGetParameterCOTEODSubmissionList = (
  payload: GenericBucketRequestDto<ParameterCOTEODFilterSubmissionRequest>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterCotEod.submission', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-cot-eod', 'submission', payload],
  });
  return query;
};

export default useGetParameterCOTEODSubmissionList;
