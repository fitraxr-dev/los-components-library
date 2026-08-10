import { useQuery } from '@tanstack/react-query';


import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


export interface ParameterSLAFilterGroupRequest {
  bucketProcessId?: string;
  module?: string;
  slaFrom?: number;
  slaTo?: number;
  status?: Record<string, string>[];
  startLastModifiedDate?: string;
  endLastModifiedDate?: string;
}

const useGetParameterSLAList = (payload: GenericBucketRequestDto<ParameterSLAFilterGroupRequest>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterSla.group', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-sla-list', payload],
  });
  return query;
};

export default useGetParameterSLAList;
