import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

const useGetExternalRatingList = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('mip.externalRating.list', {
        data: payload,
      });

      return res.data.data.contents;
    },
    queryKey: ['mip-credit-checking-external-rating-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetExternalRatingList;
