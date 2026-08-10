import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface ParameterRateFilterDetailRequest {
  id?: number;
  menuCode?: string;
}

const useGetParameterRateDetail = (payload: ParameterRateFilterDetailRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterRate.detail', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-rate', 'detail', payload],
  });
  return query;
};

export default useGetParameterRateDetail;
