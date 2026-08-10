import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetParameterRateList = () => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterRate.list', {
        data: {},
      });

      return res.data?.data;
    },
    queryKey: ['parameter-rate', 'list'],
  });
  return query;
};

export default useGetParameterRateList;
