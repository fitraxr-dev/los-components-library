import { useQuery } from '@tanstack/react-query';


import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


export interface ParameterSLAFilterSubmissionRequest {
  bucketProcessId?: string;
  module?: string;
  slaFrom?: number;
  slaTo?: number;
  status?: Record<string, string>[];
  startLastModifiedDate?: string;
  endLastModifiedDate?: string;
}

const useGetParameterSLASubmissionList = (payload: GenericBucketRequestDto<ParameterSLAFilterSubmissionRequest>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterSla.submission', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-sla-submission-list', payload],
  });
  return query;
};

export default useGetParameterSLASubmissionList;
