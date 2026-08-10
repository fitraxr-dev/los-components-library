import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetParameterListByModule = (module) => {
  const query = useQuery({
    enabled: !!module,
    queryFn: async () => {
      const res = await API('parameter.parameter.getListByModule', {
        data: {
          module,
        },
      });

      return res.data?.data;
    },
    queryKey: ['parameter', 'list-by-module', module],
  });

  return query;
};

export default useGetParameterListByModule;
