import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import {
  AdditionalInformationControllerApi,
  AdditionalInformationLpsbdControllerApi,
} from '@/services/openapi/agreement-service';

import type {
  AdditionalInformationLpsbdResponseDto,
  RequestByProcessIdDtoString,
} from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AdditionalInformationLpsbdControllerApi();

const useGetAdditionalInformationByIdDpop = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<AdditionalInformationLpsbdResponseDto>>

) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailAdditionalInformationLpsbd(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['additional-info-dpop', payload],
    staleTime: ONE_MINUTE,
    ...config,

  });

  return query;
};


export default useGetAdditionalInformationByIdDpop;
