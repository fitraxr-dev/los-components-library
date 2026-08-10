import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ExternalRatingControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new ExternalRatingControllerApi();

const useGetExternalRating = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailExternalRating(payload);

      return res.data.data.content;
    },
    queryKey: ['mip-credit-checking-external-rating-detail', payload],
    // staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetExternalRating;
