import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { OfferingLetterControllerApi } from '@/services/openapi/agreement-service';

import type { OfferingLetterRequestDto } from '@/services/openapi/agreement-service';


const api = new OfferingLetterControllerApi();

const useGetListOffringLetter = (payload: OfferingLetterRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListOfferingLetter(payload);

      return res.data.data;
    },
    queryKey: ['upload-offering-letter-list', payload],
  });

  return query;
};

export default useGetListOffringLetter;
