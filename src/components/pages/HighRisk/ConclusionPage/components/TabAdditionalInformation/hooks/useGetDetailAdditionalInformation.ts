import { useQuery } from '@tanstack/react-query';

import { AdditionalInformationControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new AdditionalInformationControllerApi();

const useGetDetailAdditionalInformation = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailAdditionalInformation(payload);

      return res.data.data.content;
    },
    queryKey: ['additional-information', payload],
  });

  return query;
};

export default useGetDetailAdditionalInformation;
