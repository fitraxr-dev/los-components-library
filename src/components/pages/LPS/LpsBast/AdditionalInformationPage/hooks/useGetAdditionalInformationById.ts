import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AdditionalInformationControllerApi } from '@/services/openapi/agreement-service';

import type {
  AdditionalInformationResponseDto,
  RequestByProcessIdDtoString,
} from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AdditionalInformationControllerApi();

const useGetAdditionalInformationById = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<AdditionalInformationResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailAdditionalInformation(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['additional-info-bast-bisnis', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};


export default useGetAdditionalInformationById;
