import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DelstRequestControllerApi } from '@/services/openapi/technical-review-service';

import type { GetDelstRequestDto } from '@/services/openapi/technical-review-service';


const api = new DelstRequestControllerApi();

const useGetTechnicalReview = (payload: GetDelstRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDelstRequest(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['technical-review', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetTechnicalReview;
