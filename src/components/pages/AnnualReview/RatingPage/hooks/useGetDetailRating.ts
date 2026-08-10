import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByProcessIdDtoString } from '../Rating.type';


const useGetAdditionalInformationById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('mip.rating.getDetail', {
        data: payload,
      });

      return res?.data?.data?.content;
    },
    queryKey: ['mip-rating', payload],
  });

  return query;
};


export default useGetAdditionalInformationById;
