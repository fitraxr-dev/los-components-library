import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


export interface ParameterLOVFilterRequest {
  startModifiedDate?: string;
  endModifiedDate?: string;
}

const useGetParameterLOVList = (payload: GenericBucketRequestDto<ParameterLOVFilterRequest>) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterLov.list', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-lov-list', payload],
  });
  return query;
};

export default useGetParameterLOVList;
