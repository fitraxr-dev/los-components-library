import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


export interface ParameterLOVHistoryFilterRequest {
  startModifiedDate?: string;
  endModifiedDate?: string;
}

const useGetParameterLOVHistoryList = (payload: GenericBucketRequestDto<ParameterLOVHistoryFilterRequest>) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterLov.uploadHistory', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-lov-history-list', payload],
  });
  return query;
};

export default useGetParameterLOVHistoryList;
