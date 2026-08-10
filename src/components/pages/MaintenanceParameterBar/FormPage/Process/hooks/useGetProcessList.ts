import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UseGetProcessListParams {
  filter?: Record<string, any>;
  page?: {
    itemPerPage: number;
    noPage: number;
  };
  searchDetail?: {
    key: string;
    value: string;
  };
  sortList?: {
    key: string;
    value: string;
  };
}

const useGetProcessList = (params: UseGetProcessListParams | null) => {
  return useQuery({
    enabled: !!params,
    queryFn: async () => {
      if (!params) return null;

      const response = await API('parameter.parameterBar.getProcessList', {
        data: params,
      });
      return response;
    },
    queryKey: ['parameterBarProcessList', params],
  });
};

export default useGetProcessList;
