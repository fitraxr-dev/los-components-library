import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ExternalRatingControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new ExternalRatingControllerApi();

const useGetExternalRatingList = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAllExternalRating(payload);

      return res.data.data.contents;
    },
    queryKey: ['mip-credit-checking-external-rating-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetExternalRatingList;
