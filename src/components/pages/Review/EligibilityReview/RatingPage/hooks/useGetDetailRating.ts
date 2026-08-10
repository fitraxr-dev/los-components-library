import { useQuery } from '@tanstack/react-query';

import { RatingControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new RatingControllerApi();

const useGetAdditionalInformationById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailRating(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-rating', payload],
  });

  return query;
};


export default useGetAdditionalInformationById;
