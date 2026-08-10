import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


interface ParameterGroupSubmissionListFilter {
  module: string;
  status?: Record<string, string>[];
  startLastModifiedDate?: string;
  endLastModifiedDate?: string;
}

const useGetParameterGroupSubmissionList = (payload: GenericBucketRequestDto<ParameterGroupSubmissionListFilter>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.submission', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'submission', payload],
  });

  return query;
};

export default useGetParameterGroupSubmissionList;
