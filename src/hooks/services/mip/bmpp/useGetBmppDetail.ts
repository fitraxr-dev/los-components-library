import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetBmppDetail = (payload: any) => {
  const query = useQuery<any>({
    enabled: Object.values(payload || {}).every((value) => !!value),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('mip.bmpp.detail', {
          data: payload,
        });
        console.log('API response:', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['bmpp-calculation-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetBmppDetail;
