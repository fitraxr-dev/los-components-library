import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


interface ParameterGroupSubItemListFilter {
  id: number | string;
  bucketProcessId?: string | null;
}

const useGetParameterGroupSubItemList = (payload: GenericBucketRequestDto<ParameterGroupSubItemListFilter>) => {
  const query = useQuery({
    enabled: !!(payload.filter.id || payload.filter.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.subItemList', { data: payload });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'sub-item', 'list', payload],
  });

  return query;
};

export default useGetParameterGroupSubItemList;
