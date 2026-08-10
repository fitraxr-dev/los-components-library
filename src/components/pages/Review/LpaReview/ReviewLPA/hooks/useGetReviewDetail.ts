import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ReviewControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/lpa-service';


const api = new ReviewControllerApi() ;

const useGetReviewDetail = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailReview(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['lpa-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetReviewDetail;
