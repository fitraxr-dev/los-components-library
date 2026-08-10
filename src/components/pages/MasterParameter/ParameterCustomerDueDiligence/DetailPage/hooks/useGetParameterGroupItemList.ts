import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


interface ParameterGroupItemListFilter {
  id: number | string;
  bucketProcessId?: string | null;
}

const useGetParameterGroupItemList = (payload: GenericBucketRequestDto<ParameterGroupItemListFilter>) => {
  const query = useQuery({
    enabled: !!(payload.filter.id || payload.filter.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.itemList', { data: payload });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'item', 'list', payload],
  });

  return query;
};

export default useGetParameterGroupItemList;
