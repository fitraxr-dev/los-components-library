import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { OfferingLetterControllerApi } from '@/services/openapi/agreement-service';

import type { OfferingLetterRequestDto } from '@/services/openapi/agreement-service';


const api = new OfferingLetterControllerApi();

const useGetDetailOfferingLetter = (payload: OfferingLetterRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailOfferLetter(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['offering-letter-detail', payload],
    // staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailOfferingLetter;
