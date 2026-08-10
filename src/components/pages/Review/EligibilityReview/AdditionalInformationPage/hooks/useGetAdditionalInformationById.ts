import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AdditionalInformationControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new AdditionalInformationControllerApi();

const useGetAdditionalInformationById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailAdditionalInformation(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-additional-information', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetAdditionalInformationById;
