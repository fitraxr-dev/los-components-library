import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface RequestByIdDtoLong {
  id: number;
}

const useGetExternalRating = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('mip.externalRating.detail', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['mip-credit-checking-external-rating-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetExternalRating;
