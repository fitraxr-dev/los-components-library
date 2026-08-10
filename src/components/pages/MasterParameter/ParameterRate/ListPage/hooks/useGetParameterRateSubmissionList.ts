import { useQuery } from '@tanstack/react-query';


import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


export interface ParameterRateFilterSubmissionRequest {
  currency?: Record<string, string>[];
  status?: Record<string, string>[];
  startLastModifiedDate?: string;
  endLastModifiedDate?: string;
}

const useGetParameterRateSubmissionList = (payload: GenericBucketRequestDto<ParameterRateFilterSubmissionRequest>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterRate.submission', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-rate', 'submission', 'list', payload],
  });
  return query;
};

export default useGetParameterRateSubmissionList;
