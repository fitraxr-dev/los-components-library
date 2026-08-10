import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface ParameterGroupFilterDetailRequest {
  id?: string | number;
}

const useGetParameterGroupDetail = (payload: ParameterGroupFilterDetailRequest) => {
  const query = useQuery({
    enabled: !!payload.id,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.detail', {
        data: { id: Number(payload.id) },
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'detail', payload],
  });
  return query;
};

export default useGetParameterGroupDetail;
