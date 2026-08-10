import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RequestControllerApi } from '@/services/openapi/technical-review-service';

import type { GetRequestByProcessDto } from '@/services/openapi/technical-review-service';


const api = new RequestControllerApi();

const useGetTechnicalReviewRequest = (payload: GetRequestByProcessDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getRequestTechnicalReview(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['technical-review-request', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetTechnicalReviewRequest;
