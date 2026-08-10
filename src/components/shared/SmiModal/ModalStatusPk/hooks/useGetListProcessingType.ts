import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { PkProcessingTypeControllerApi } from '@/services/openapi/agreement-service';

import type {
  RequestByProcessIdDtoString,
  GenericListDtoPKProcessingTypeResponseDto,
} from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new PkProcessingTypeControllerApi();


const useGetListProcessingType = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<GenericListDtoPKProcessingTypeResponseDto>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getListProcessingType(payload);
        return res.data.data;
      },
      queryKey: [
        'pk-processing-type-list',
        payload
      ],
      ...config,
    }
  );

  return query;
};


export default useGetListProcessingType;
