import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

const useGetDebtorExternalRating = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: Object.values(payload).every((value) => !!value),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('mip.creditChecking.creditCheckingExternal', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['external-rating', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDebtorExternalRating;
