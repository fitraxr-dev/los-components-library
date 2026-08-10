import { useQuery } from '@tanstack/react-query';


import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


export interface ParameterRateFilterHistoryRequest {
  status?: Record<string, string>[];
  currency?: Record<string, string>[];
  startLastModifiedDate?: string;
  endLastModifiedDate?: string;
}

const useGetParameterRateHistoryList = (payload: GenericBucketRequestDto<ParameterRateFilterHistoryRequest>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterRate.history', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-rate', 'history', 'list', payload],
  });
  return query;
};

export default useGetParameterRateHistoryList;
