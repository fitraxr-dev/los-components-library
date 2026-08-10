import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';
import type { UseQueryOptions } from '@tanstack/react-query';


export interface ParameterLOVItemFilterRequest {
  module?: string;
  bucketProcessId?: string;
}

const useGetParameterLOVItemList = (
  payload: GenericBucketRequestDto<any>,
  options?: Partial<UseQueryOptions<any, Error, any, any>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterLov.itemList', {
        data: payload,
      });
      return res.data?.data;
    },
    queryKey: ['parameter-lov-item-list', payload],
    ...options, // This will override enabled if provided
    enabled: !!payload, // Only enabled when payload exists
  });
  return query;
};

export default useGetParameterLOVItemList;
