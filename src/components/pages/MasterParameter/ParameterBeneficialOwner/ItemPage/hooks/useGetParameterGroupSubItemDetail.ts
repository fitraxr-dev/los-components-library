import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface ParameterGroupFilterSubItemDetailRequest {
  id?: string | number;
  bucketProcessId?: string;
}

const useGetParameterGroupSubItemDetail = (payload: ParameterGroupFilterSubItemDetailRequest) => {
  console.log('SUBITEM DETAIL PAYLOAD', payload);
  const query = useQuery({
    enabled: !!(payload.id && payload.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.subItemDetail', { data: payload });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'detail', payload],
  });
  return query;
};

export default useGetParameterGroupSubItemDetail;
