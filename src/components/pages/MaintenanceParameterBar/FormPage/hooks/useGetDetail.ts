import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UseGetDetailParams {
  id: string;
}

const useGetDetail = (params: UseGetDetailParams | null) => {
  return useQuery({
    enabled: !!params?.id,
    queryFn: async () => {
      if (!params?.id) return null;

      const response = await API('parameter.parameterBar.getDetail', {
        data: { id: params.id },
      });
      return response;
    },
    queryKey: ['parameterBarDetail', params],
  });
};

export default useGetDetail;
