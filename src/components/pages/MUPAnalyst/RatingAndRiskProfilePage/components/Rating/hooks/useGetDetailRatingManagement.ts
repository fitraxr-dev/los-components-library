import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RatingControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new RatingControllerApi() ;

const useGetDetailRatingManagement = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailRating(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['rating-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailRatingManagement;
