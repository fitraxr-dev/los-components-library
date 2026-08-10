import { useQuery } from '@tanstack/react-query';


import { API } from '@/helpers/api';


export interface ParameterSLADetailRequest {
  id: string;
}

const useGetParameterSLADetail = (payload: ParameterSLADetailRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterSla.detail', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-sla-detail', payload],
  });
  return query;
};

export default useGetParameterSLADetail;
