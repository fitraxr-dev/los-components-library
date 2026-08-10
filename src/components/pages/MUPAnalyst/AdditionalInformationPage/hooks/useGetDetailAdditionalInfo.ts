import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AdditionalInformationControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new AdditionalInformationControllerApi() ;

const useGetDetailAdditionalInfo = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailAdditionalInformation(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['additional-info-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailAdditionalInfo;
