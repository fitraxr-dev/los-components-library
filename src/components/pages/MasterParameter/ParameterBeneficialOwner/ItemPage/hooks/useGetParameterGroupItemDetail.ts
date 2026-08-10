import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface ParameterGroupFilterItemDetailRequest {
  id?: string | number;
  bucketProcessId?: string;
}

const useGetParameterGroupItemDetail = (payload: ParameterGroupFilterItemDetailRequest) => {
  const query = useQuery({
    enabled: !!(payload.id && payload.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.itemDetail', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'item', 'detail', payload],
  });
  return query;
};

export default useGetParameterGroupItemDetail;
