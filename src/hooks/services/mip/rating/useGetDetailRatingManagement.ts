import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetDetailRatingManagement = (payload: any) => {
  const bucketProcessId = payload?.bucketProcessId;

  const query = useQuery({
    enabled: !!bucketProcessId,
    queryFn: async () => {
      try {
        console.log('Calling API getDetailRating with payload:', payload);
        const response = await API('mip.rating.getDetail', {
          data: payload,
        });
        console.log('API response (getDetailRating):', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error (getDetailRating):', error);
        throw error;
      }
    },
    queryKey: ['rating-detail', bucketProcessId],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetDetailRatingManagement;
