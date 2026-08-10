import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AdditionalInformationControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new AdditionalInformationControllerApi() ;

const useGetDetailAdditional = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const { data } = await api.getDetailAdditionalInformation(payload);

      return data.data?.content;
    },
    queryKey: ['detail-additional', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailAdditional;
