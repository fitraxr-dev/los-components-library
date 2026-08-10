import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetConcernList = (payload: any) => {
  const query = useQuery({
    enabled: !!payload,
    queryFn: async () => {
      try {
        console.log('Calling API getListConcern with payload:', payload);
        const response = await API('mip.concern.getList', {
          data: payload,
        });
        console.log('API response (getListConcern):', response);
        return response?.data?.data?.contents;
      } catch (error) {
        console.error('API error (getListConcern):', error);
        throw error;
      }
    },
    queryKey: ['concern-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetConcernList;
