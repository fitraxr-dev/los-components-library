import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UseGetParameterBusinessCallListParams {
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

const useGetParameterBusinessCallList = (params: UseGetParameterBusinessCallListParams) => {
  return useQuery({
    enabled: true,
    queryFn: async () => {
      const response = await API('parameter.parameterBar.parameterList', {
        data: params,
      });
      return response;
    },
    queryKey: ['parameterBusinessCallList', params],
  });
};

export default useGetParameterBusinessCallList;
